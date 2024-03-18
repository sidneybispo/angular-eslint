import { RuleTester } from '@angular-eslint/utils';
import { renderTemplate } from '@angular-eslint/template-renderer';
import rule, { RULE_NAME } from '../../../src/rules/accessibility-label-for';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
});

const templateRenderer = (template: string) => renderTemplate(__filename, template);

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      template: '<button [attr.aria-label]="label">Button</button>',
      filename: __filename
    },
    ...valid
  ].map(templateRenderer),
  invalid: [
    {
      template: '<button>Button</button>',
      errors: ['For accessible names, use "aria-label" or "aria-labelledby".'],
      filename: __filename
    },
    ...invalid
  ].map(templateRenderer)
});
