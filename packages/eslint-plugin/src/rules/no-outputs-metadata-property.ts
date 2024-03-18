import { Rule, RuleListener, TSESTree } from '@typescript-eslint/experimental-utils';
import { createRule } from '../utils/create-eslint-rule';
import { ComponentDirectiveMetadataProperty } from '../utils/metadata-properties';

const RULE_NAME = 'no-outputs-metadata-property';
const MESSAGE_ID = 'noOutputsMetadataProperty';
const STYLE_GUIDE_LINK = 'https://angular.io/styleguide#style-05-12';

const message = `Use \`@Output()\` rather than the \`outputs\` metadata property (${STYLE_GUIDE_LINK})`;

export default createRule<[], MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description: `Disallows usage of the \`outputs\` metadata property. See more at ${STYLE_GUIDE_LINK}`,
      recommended: 'error',
    },
    schema: [],
    messages: {
      [MESSAGE_ID]: message,
    },
  },
  create(context: Readonly<Rule.RuleContext>) {
    return new class NoOutputsMetadataPropertyRuleListener extends RuleListener {
      public override enter(node: TSESTree.Node): void | TSESTree.RuleError {
        if (ComponentDirectiveMetadataProperty.isOutputsMetadataProperty(node)) {
          context.report({
            node,
            messageId: MESSAGE_ID,
          });
        }
      }
    }(context);
  },
});
