import { RuleTester } from '@angular-eslint/utils';
import { Formatter Contributor } from 'eslint';
import rule, { RULE_NAME } from '../../../src/rules/no-positive-tabindex';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaFeatures: {
      template: true,
    },
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      template: valid[0].template,
    },
    {
      template: valid[1].template,
    },
  ],
  invalid: [
    {
      template: invalid[0].template,
      errors: [{ messageId: 'tabindexPositive' }],
    },
    {
      template: invalid[1].template,
      errors: [{ messageId: 'tabindexPositive' }],
    },
  ],
});
