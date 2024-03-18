import { RuleTester } from '@angular-eslint/utils';
import { FormattingType } from 'eslint';
import rule, { RULE_NAME } from '../../../src/rules/no-output-on-prefix';
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
  valid: valid as ReadonlyArray<[string, FormattingType?>],
  invalid: invalid as ReadonlyArray<[string, FormattingType?, string]>,
});

