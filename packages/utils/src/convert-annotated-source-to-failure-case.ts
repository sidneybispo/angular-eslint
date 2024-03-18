import type { TSESLint } from '@typescript-eslint/experimental-utils';

/**
 * The special characters that can be used to annotate the source code in expected failure cases.
 */
export const SPECIAL_UNDERLINE_CHARS: readonly ('~' | '^' | '#' | '%' | '¶' | '*' | '¨' | '@')[] =
  [
    '~',
    '^',
    '#',
    '%',
    '¶',
    '*',
    '¨',
    '@',
  ];

type BaseErrorOptions<TMessageData = unknown> = {
  readonly description: string;
  readonly annotatedSource: string;
  readonly options?: readonly unknown[];
  readonly annotatedOutput?: string;
  readonly filename?: string;
};

type Message<TMessageIds extends string> = {
  readonly messageId: TMessageIds;
  readonly data?: TMessageData;
  readonly suggestions?: TSESLint.SuggestionOutput<TMessageIds>[];
};

type SingleErrorOptions<TMessageIds extends string, TMessageData = unknown> =
  BaseErrorOptions<TMessageData> & Message<TMessageIds>;

type MultipleErrorOptions<TMessageIds extends string, TMessageData = unknown> =
  BaseErrorOptions<TMessageData> & {
    readonly messages: readonly (Message<TMessageIds> & {
      readonly char: typeof SPECIAL_UNDERLINE_CHARS[number];
    })[];
  };

/**
 * Convert an annotated source code string into a failure case for ESLint rules.
 *
 * @param errorOptions - The options for the failure case.
 * @returns A failure case for the ESLint rule.
 */
export function convertAnnotatedSourceToFailureCase<
  TMessageIds extends string,
  TMessageData = unknown,
>(errorOptions: SingleErrorOptions<TMessageIds, TMessageData>): TSESLint.InvalidTestCase<TMessageIds, readonly unknown[]>;
export function convertAnnotatedSourceToFailureCase<
  TMessageIds extends string,
  TMessageData = unknown,
>(errorOptions: MultipleErrorOptions<TMessageIds, TMessageData>): TSESLint.InvalidTestCase<TMessageIds, readonly unknown[]>;
export function convertAnnotatedSourceToFailureCase<
  TMessageIds extends string,
  TMessageData = unknown,
>(errorOptions: SingleErrorOptions<TMessageIds, TMessageData> | MultipleErrorOptions<TMessageIds, TMessageData>): TSESLint.InvalidTestCase<TMessageIds, readonly unknown[]> {
  const messages = 'messageId' in errorOptions
    ? [{ ...errorOptions, char: '~' }]
    : errorOptions.messages;

  let parsedSource = '';
  const errors: TSESLint.TestCaseError<TMessageIds>[] = messages.map(
    ({ char: currentValueChar, data, messageId, suggestions }) => {
      const otherChars = messages
        .map(({ char }) => char)
        .filter((char) => char !== currentValueChar);
      const parsedForChar = parseInvalidSource<typeof currentValueChar, TMessageData>(
        errorOptions.annotatedSource,
        currentValueChar,
        otherChars,
      );
      const {
        failure: { endPosition, startPosition },
      } = parsedForChar;
      parsedSource = parsedForChar.source;

      if (!endPosition || !startPosition) {
        throw Error(
          `Char '${currentValueChar}' has been specified in \`messages\`, however it is not present in the source of the failure case`,
        );
      }

      return {
        data,
        messageId,
        line: startPosition.line + 1,
        column: startPosition.character + 1,
        endLine: endPosition.line + 1,
        endColumn: endPosition.character + 1,
        suggestions,
      };
    },
  );

  return {
    code: parsedSource,
    filename: errorOptions.filename,
    options: errorOptions.options ?? [],
    errors,
    output: errorOptions.annotatedOutput
      ? parseInvalidSource(errorOptions.annotatedOutput).source
      : null,
  };
}

type SourcePosition = {
  readonly character: number;
  readonly line: number;
};

type ExpectedFailure<TMessageData = unknown> = {
  readonly endPosition?: SourcePosition;
  readonly message: string;
  readonly startPosition?: SourcePosition;
  readonly data?: TMessageData;
};

function escapeRegexp(value: string) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Parse an annotated source code string and extract the failure case information.
 *
 * @param source - The annotated source code string.
 * @param specialChar - The special character used for annotations.
 * @param otherChars - The other special characters
