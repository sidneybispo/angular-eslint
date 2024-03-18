import { RuleTester } from '@angular-eslint/utils';
import { parseSourceString } from '@typescript-eslint/parser';
import rule, { RULE_NAME } from '../../../src/rules/no-lifecycle-call';
import {
  createRuleTesterTestCases,
  TestCase,
} from '../../test-utils/rule-tester-test-cases';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

const testCases: TestCase[] = [
  ...createRuleTesterTestCases(valid, parseSourceString),
  ...createRuleTesterTestCases(invalid, parseSourceString),
];

ruleTester.run(RULE_NAME, rule, testCases);
