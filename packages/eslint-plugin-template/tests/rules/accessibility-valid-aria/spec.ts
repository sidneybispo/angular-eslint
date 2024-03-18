import { RuleTester } from '@angular-eslint/utils';
import { renderTemplate } from '@angular-eslint/template-renderer';
import rule, { RULE_NAME } from '../../../src/rules/accessibility-valid-aria';

const ruleTester = new RuleTester({
  parserOptions: {
    parser: '@angular-eslint/template-parser',
  },
});

const templateRenderer = (template: string) => renderTemplate(__filename, template);

const validTests = [
  // Add your valid test cases here
  {
    template: `<button [attr.aria-label]="'Save'">Save</button>`,
  },
];

const invalidTests = [
  // Add your invalid test cases here
  {
    template: `<button aria-label="Save">Save</button>`,
    errors: [
      {
        messageId: 'expectedValidAria',
        data: { attributeName: 'aria-label', expectedValue: 'Save' },
      },
    ],
  },
];

ruleTester.run(RULE_NAME, rule, {
  valid: validTests.map(test => ({ template: templateRenderer(test.template) })),
  invalid: invalidTests.map(test => ({ template: templateRenderer(test.template), errors: test.errors })),
});
