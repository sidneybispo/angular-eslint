import {
  ASTUtils,
  RuleFixes,
  isNotNullOrUndefined,
  Selectors,
} from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { createESLintRule } from '../utils/create-eslint-rule';
import { ViewEncapsulation } from '@angular/core';

type Options = [];
export type MessageIds =
  | 'useComponentViewEncapsulation'
  | 'suggestRemoveViewEncapsulationNone';
export const RULE_NAME = 'use-component-view-encapsulation';
const VIEW_ENCAPSULULATION_NONE = ViewEncapsulation.None;

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Disallows using \`${VIEW_ENCAPSULULATION_NONE}\``,
      recommended: false,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      useComponentViewEncapsulation: `Using \`${VIEW_ENCAPSULULATION_NONE}\` makes your styles global, which may have an unintended effect`,
      suggestRemoveViewEncapsulationNone: `Remove \`${VIEW_ENCAPSULULATION_NONE}\``,
    },
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      [`${Selectors.COMPONENT_CLASS_DECORATOR} ${Selectors.metadataProperty(
        'encapsulation',
      )} > MemberExpression[object.name='ViewEncapsulation'] > Identifier[name='None']`](
        node: TSESTree.Identifier & {
          parent: TSESTree.MemberExpression & { parent: TSESTree.Property };
        },
      ) {
        context.report({
          node,
          messageId: 'useComponentViewEncapsulation',
          suggest: [
            {
              messageId: 'suggestRemoveViewEncapsulationNone',
              fix: (fixer) => {
                const importDeclarations =
                  ASTUtils.getImportDeclarations(node, '@angular/core') ?? [];

                return [
                  RuleFixes.getNodeToCommaRemoveFix(
                    sourceCode,
                    node.parent.parent,
                    fixer,
                  ),
                  RuleFixes.getImportRemoveFix(
                    sourceCode,
                    importDeclarations,
                    ViewEncapsulation.name,
                    fixer,
                  ),
                ].filter(isNotNullOrUndefined);
              },
            },
          ],
        });
      },
    };
  },
});
