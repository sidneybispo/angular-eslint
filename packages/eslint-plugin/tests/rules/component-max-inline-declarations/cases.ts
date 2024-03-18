import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/component-max-inline-declarations';

const messageId: MessageIds = 'componentMaxInlineDeclarations';

interface ValidCase {
  description: string;
  code: string;
}

interface InvalidCase {
  description: string;
  code: string;
  options?: { [key: string]: number };
  data: { lineCount: number; max: number; propertyType: string };
}

const validCases: ValidCase[] = [
  {
    description: 'should succeed if the number of the template lines does not exceeds the default lines limit',
    code: `
      @Component({
        template: '<div>just one line template</div>'
      })
      class Test {}
    `,
  },
  // ... other valid cases
];

const invalidCases: InvalidCase[] = [
  {
    description: 'should fail if the number of the template lines exceeds the default lines limit',
    code: `
      @Component({
        template: \`
                  ~
          <div>first line</div>
          <div>second line</div>
          <div>third line</div>
          <div>fourth line</div>
        \`
        ~
      })
      class Test {}
    `,
    data: { lineCount: 4, max: 3, propertyType: 'template' },
  },
  // ... other invalid cases
];

const convertAnnotatedSourceToInvalidCase = (
  data: { description: string; annotatedSource: string; messageId: MessageIds; data: any },
): InvalidCase => {
  const { description, annotatedSource, messageId, data: caseData } = data;
  const code = annotatedSource
    .replace(/~/g, '')
    .replace(/\n\s*/g, '\n')
    .trim();

  return {
    description,
    code,
    data: caseData,
  };
};

const invalidTestCases = invalidCases.map(convertAnnotatedSourceToInvalidCase);

export const testCases = [...validCases, ...invalidTestCases];
