import type {
  Node,
  TmplAstElement,
} from '@angular-eslint/bundled-angular-compiler';
import {
  createESLintRule,
  getTemplateParserServices,
} from '../utils/create-eslint-rule';
import { getAttributeValue } from '../utils/get-attribute-value';

type Options = [];
export type MessageIds = 'accessibilityAltText';
export const RULE_NAME = 'accessibility-alt-text';

const ELEMENTS_WITH_ALT_OR_TITLE = ['img', 'object', 'input[type="image"]'];
const ALLOWED_PROPERTIES = ['alt', 'aria-label', 'aria-labelledby', 'title'];

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforces alternate text for elements which require the alt, aria-label, aria-labelledby attributes.',
      recommended: false,
    },
    schema: [],
    messages: {
      accessibilityAltText:
        '<{{element}}/> element must have a text alternative.',
    },
  },
  defaultOptions: [],
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      'Element$1[name]'(node: TmplAstElement) {
        if (ELEMENTS_WITH_ALT_OR_TITLE.includes(node.name)) {
          const isValid = hasValidAltOrTitle(node);

          if (!isValid) {
            const loc = parserServices.convertElementSourceSpanToLoc(
              context,
              node,
            );

            context.report({
              loc,
              messageId: 'accessibilityAltText',
              data: {
                element: node.name,
              },
            });
          }
        }
      },
    };
  },
});

function hasValidAltOrTitle(node: TmplAstElement): boolean {
  const hasValidAttribute = hasValidAttribute(node.attributes);
  if (hasValidAttribute) {
    return true;
  }

  return hasValidAttribute(node.inputs);
}

function hasValidAttribute(
  attributes: ReadonlyArray<
    | { name: string }
    | { name: string; value: string }
  >,
): boolean {
  return attributes.some((attribute) =>
    ALLOWED_PROPERTIES.includes(attribute.name),
  );
}
