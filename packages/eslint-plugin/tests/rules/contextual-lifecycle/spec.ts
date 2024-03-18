import { RuleTester } from '@angular-eslint/utils';
import { parseSource } from '@eslint-plugins/angular/utils';
import rule, { RULE_NAME } from '../../../src/rules/contextual-lifecycle';
import {
  createRuleTesterTest,
  LifecycleMethods,
} from '../../test-utils/rule-test-utils';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const lifecycleMethods: LifecycleMethods = ['ngOnInit', 'ngOnDestroy'];

createRuleTesterTest(ruleTester, rule, {
  valid: [
    {
      name: 'should pass when using lifecycle methods correctly',
      code: valid,
    },
  ],
  invalid: [
    {
      name: 'should fail when using ngOnInit in the constructor',
      code: invalid.constructor,
      errors: [
        {
          messageId: 'disallowInConstructor',
          data: {
            methodName: lifecycleMethods[0],
          },
        },
      ],
    },
    {
      name: 'should fail when using ngOnInit in the wrong place',
      code: invalid.wrongPlace,
      errors: [
        {
          messageId: 'disallowOutsideComponent',
          data: {
            methodName: lifecycleMethods[0],
          },
        },
      ],
    },
    {
      name: 'should fail when using ngOnInit without constructor',
      code: invalid.noConstructor,
      errors: [
        {
          messageId: 'requireConstructor',
        },
      ],
    },
    {
      name: 'should fail when using ngOnInit with wrong parameters',
      code: invalid.wrongParameters,
      errors: [
        {
          messageId: 'invalidParameters',
          data: {
            methodName: lifecycleMethods[0],
            expectedParameters: '(void)',
            receivedParameters: '(number)',
          },
        },
