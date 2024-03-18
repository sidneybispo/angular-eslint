import { RuleTester } from '@angular-eslint/utils';
import rule, { RULE_NAME } from '../../../src/rules/no-input-prefix';
import { createValidTests, createInvalidTests } from '../rule-test-utils';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

const validTests = createValidTests({
  ruleName: RULE_NAME,
  casesPath: './cases/valid.ts',
});

const invalidTests = createInvalidTests({
  ruleName: RULE_NAME,
  casesPath: './cases/invalid.ts',
});

ruleTester.run(RULE_NAME, rule, {
  valid: validTests,
  invalid: invalidTests,
});


// rule-test-utils.ts

export const createValidTests = ({ ruleName, casesPath }) => {
  return {
    valid: {
      [casesPath]: {
        code: require(casesPath).default,
        errors: [],
      },
    },
  };
};

export const createInvalidTests = ({ ruleName, casesPath }) => {
  return {
    invalid: {
      [casesPath]: {
        code: require(casesPath).default,
        errors: require(casesPath).errors,
      },
    },
  };
};


// cases/valid.ts

export default {
  testComponent: `
    import { Component } from '@angular/core';

