import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/no-duplicate-attributes';

const messageId: MessageIds = 'noDuplicateAttributes';
const suggestRemoveAttribute: MessageIds = 'suggestRemoveAttribute';

const cases = [
  {
    code: `
      <input [name]="foo" [name]="bar">
    `,
    template: `
      <input [name]="bar">
    `,
    errors: [
      {
        messageId,
        data: { attributeName: 'name' },
        suggestions: [
          {
            messageId: suggestRemoveAttribute,
            output: `
              <input [name]="bar">
            `,
            data: { attributeName: 'name' },
          },
        ],
      },
    ],
  },
  {
    code: `
      <input [name]="foo" name="bar">
    `,
    template: `
      <input name="bar">
    `,
    errors: [
      {
        messageId,
        data: { attributeName: 'name' },
        suggestions: [
          {
            messageId: suggestRemoveAttribute,
            output: `
              <input name="bar">
            `,
            data: { attributeName: 'name' },
          },
        ],
      },
    ],
  },
  {
    code: `
      <input name="foo" name="bar">
    `,
    template: `
      <input name="bar">
    `,
    errors: [
      {
        messageId,
        data: { attributeName: 'name' },
        suggestions: [
          {
            messageId: suggestRemoveAttribute,
            output: `
              <input name="bar">
            `,
            data: { attributeName: 'name' },
          },
        ],
      },
    ],
  },
  // More cases...
];

export default cases;
