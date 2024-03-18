import {
  ASTUtils,
  RuleFixes,
  isNotNullOrUndefined,
  Selectors,
  toPattern,
} from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { createESLintRule } from '../utils/create-eslint-rule';

type Options = [];
type MessageIds =
  | 'noEmptyLifecycleMethod'
  | 'suggestRemoveLifecycleMethod';

export const RULE_NAME = 'no-empty-lifecycle-method';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallows declaring empty lifecycle methods',
      recommended: 'error',
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noEmptyLifecycleMethod: 'Lifecycle methods should not be empty',
      suggestRemoveLifecycleMethod: 'Remove lifecycle method',
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();
    const angularLifecycleMethodsPattern = toPattern([
      ...ASTUtils.ANGULAR_LIFECYCLE_METHODS,
    ]);

    return {
      [Selectors.methodDefinition(Selectors.isLifecycleMethod(angularLifecycleMethodsPattern))[value.body.body.length=0]](
        node: TSESTree.MethodDefinition & {
          parent: TSESTree.ClassBody & { parent: TSESTree.ClassDeclaration };
        },
      ) {
        context.report({
          node,
          messageId: 'noEmptyLifecycleMethod',
          suggest: [
            {
              messageId: 'suggestRemoveLifecycleMethod',
              fix: (fixer) => {
                const importDeclarations =
                  ASTUtils.getImportDeclarations(node, '@angular/core') ?? [];
                const interfaceName = ASTUtils.getRawText(node).replace(
                  /^ng+/,
                  '',
                );
                const text = sourceCode.getText();
                const totalInterfaceOccurrences = (text.match(new RegExp(interfaceName, 'g')) || []).length;
                const totalInterfaceOccurrencesSafeForRemoval = 2;

                return [
                  fixer.remove(node),
                  RuleFixes.getImplementsRemoveFix(
                    sourceCode,
                    node.parent.parent,
                    interfaceName,
                    fixer,
                  ),
                  totalInterfaceOccurrences <=
                  totalInterfaceOccurrencesSafeForRemoval
                    ? RuleFixes.getImportRemoveFix(
                        sourceCode,
                        importDeclarations,
                        interfaceName,
                        fixer,
                      )
                    : null,
                ].filter(isNotNullOrUndefined);
              },
            },
          ],
        });
      },
    };
  },
});

function stripSpecialCharacters(text: string) {
  return text.replace(/[\W]/g, '');
}



/** @type {import('eslint').Linter.Config} */
const rule = {
  // ...
};

module.exports = rule;
module.exports.ruleName = RULE_NAME;



{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "@angular-eslint"
  ],
  "extends": [
    "plugin:@angular-eslint/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "rules": {
    // ...
  }
}

