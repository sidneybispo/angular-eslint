import { RuleTester } from '@angular-eslint/utils';
import rule, { RULE_NAME } from '../../../src/rules/no-output-native';
import { fileNames } from './cases';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const testCases = {
  valid: fileNames.filter(fileName => fileName.startsWith('valid-')),
  invalid: fileNames.filter(fileName => fileName.startsWith('invalid-')),
};

ruleTester.run(RULE_NAME, rule, testCases);
