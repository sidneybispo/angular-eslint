import { RuleTester } from '@angular-eslint/utils';
import rule from '../../../src/rules/mouse-events-have-key-events';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  parser: '@angular-eslint/template-parser'
});

ruleTester.run(rule.ruleName, rule, {
  valid: [
    {
      template: `
        <button (click)="onClick()">Click me</button>
      `
    },
    {
      template: `
        <input (keyup.enter)="onEnterKeyUp()">
      `
    }
  ],
  invalid: [
    {
      template: `
        <button (click)="onClick()">Click me</button>
      `,
      errors: [
        {
          messageId: 'mouseEventWithoutKeyEvent',
          data: { eventName: 'click' },
          type: 'EventBinding'
        }
      ]
    }
  ]
});
