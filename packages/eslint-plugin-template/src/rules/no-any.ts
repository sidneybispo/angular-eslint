import type { CallExpression, Node, SourceCode } from 'eslint';
import {
  ImplicitReceiver,
  PropertyRead,
  ThisReceiver,
} from '@angular-eslint/bundled-angular-compiler';
import {
  createESLintRule,
  ensureTemplateParser,
} from '../utils/create-eslint-rule';

type Options = [];
type MessageIds = 'noAny' | 'suggestRemoveAny';
const ANY_TYPE_CAST_FUNCTION_NAME = '$any';

export default createESLintRule<Options, MessageIds>({
  name: 'no-any',
  meta: {
    type: 'suggestion',
    docs: {
      description: `The use of "${ANY_TYPE_CAST_FUNCTION_NAME}" nullifies the compile-time benefits of Angular's type system`,
      recommended: false,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noAny: `Avoid using "${ANY_TYPE_CAST_FUNCTION_NAME}" in templates`,
      suggestRemoveAny: `Remove ${ANY_TYPE_CAST_FUNCTION_NAME}`,
    },
  },
  defaultOptions: [],
  create(context) {
    ensureTemplateParser(context);
    const sourceCode = context.getSourceCode();

    return {
      'CallExpression[callee.name="${ANY_TYPE_CAST_FUNCTION_NAME}"]': (
        node: CallExpression
      ) => {
        const receiver = (node.object as Node & {
          type: 'MemberExpression';
        })?.property;

        if (
          !(receiver instanceof PropertyRead) ||
          !(receiver.receiver instanceof ThisReceiver) ||
          !(receiver.receiver instanceof ImplicitReceiver)
        ) {
          return;
        }

        const nameSpan = receiver.nameSpan;
        context.report({
          node,
          messageId: 'noAny',
          loc: sourceCode.getLocFromIndex(nameSpan.start),
          suggest: [
            {
              messageId: 'suggestRemoveAny',
              fix: (fixer) =>
                fixer.removeRange([nameSpan.start, nameSpan.end + 1]),
            },
          ],
        });
      },
    };
  },
});
