import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/eqeqeq';

const MESSAGE_ID: MessageIds = 'eqeqeq';
const SUGGEST_STRICT_EQUALITY: MessageIds = 'suggestStrictEquality';

export const VALID = [
  '{{ a === 1 }}',
  `<div [class.testing]="b === false">`,
  '<div *ngIf="c === test">',
  {
    code: `
        <div *appShow="(d == null && e === null && (f | lowercase) == undefined) || g === undefined">
      `,
    options: [{ allowNullOrUndefined: true }],
  },
];

export const INVALID = [
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within interpolation',
    annotatedSource: `
        {{ 'null' == test }}
           ~~~~~~~~~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '==',
      expectedOperation: '===',
    },
    annotatedOutput: `
        {{ 'null' === test }}
           ~~~~~~~~~~~~~~~
      `,
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within attribute directive',
    annotatedSource: `
        <div [attr.disabled]="test != 'undefined' && null == '3'"></div>
                              ~~~~~~~~~~~~~~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '!=',
      expectedOperation: '!==',
    },
    options: [{ allowNullOrUndefined: true }],
    annotatedOutput: `
        <div [attr.disabled]="test !== 'undefined' && null == '3'"></div>
                              ~~~~~~~~~~~~~~~~~~~~
      `,
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within structural directive',
    annotatedSource: `
        <div *ngIf="test == true || test1 !== undefined"></div>
                    ~~~~~~~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '==',
      expectedOperation: '===',
    },
    suggestions: [
      {
        messageId: SUGGEST_STRICT_EQUALITY,
        output: `
        <div *ngIf="test === true || test1 !== undefined"></div>
                    
      `,
        data: {
          actualOperation: '==',
          expectedOperation: '===',
        },
      },
    ],
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within conditional',
    annotatedSource: `
        {{ one != '02' ? c > d : 'hey!' }}
           ~~~~~~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '!=',
      expectedOperation: '!==',
    },
    suggestions: [
      {
        messageId: SUGGEST_STRICT_EQUALITY,
        output: `
        {{ one !== '02' ? c > d : 'hey!' }}
           
      `,
        data: {
          actualOperation: '!=',
          expectedOperation: '!==',
        },
      },
    ],
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within conditional (condition)',
    annotatedSource: `
        {{ a === b && 1 == b ? c > d : 'hey!' }}
                      ~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '==',
      expectedOperation: '===',
    },
    suggestions: [
      {
        messageId: SUGGEST_STRICT_EQUALITY,
        output: `
        {{ a === b && 1 === b ? c > d : 'hey!' }}
                      
      `,
        data: {
          actualOperation: '==',
          expectedOperation: '===',
        },
      },
    ],
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within conditional (trueExp)',
    annotatedSource: `
        {{ c > d ? a != b : 'hey!' }}
                   ~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '!=',
      expectedOperation: '!==',
    },
    suggestions: [
      {
        messageId: SUGGEST_STRICT_EQUALITY,
        output: `
        {{ c > d ? a !== b : 'hey!' }}
                   
      `,
        data: {
          actualOperation: '!=',
          expectedOperation: '!==',
        },
      },
    ],
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is not strict within conditional (falseExp)',
    annotatedSource: `
        {{ c > d ? 'hey!' : a == false }}
                            ~~~~~~~~~~
      `,
    messageId: MESSAGE_ID,
    data: {
      actualOperation: '==',
      expectedOperation: '===',
    },
    suggestions: [
      {
        messageId: SUGGEST_STRICT_EQUALITY,
        output: `
        {{ c > d ? 'hey!' : a === false }}
                            
      `,
        data: {
          actualOperation: '==',
          expectedOperation: '===',
        },
      },
    ],
  }),
  ...convertAnnotatedSourceToFailureCaseArray({
    description:
      'it should fail if the operation is
