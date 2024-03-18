import { RuleTester } from '@angular-eslint/utils';
import { RULE_NAME, rule } from '../../../src/rules/use-injectable-provided-in';
import { invalid, valid } from './cases';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
