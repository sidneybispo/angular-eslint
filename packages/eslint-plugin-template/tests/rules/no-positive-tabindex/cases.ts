import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/no-positive-tabindex';

type TabindexTestcase = {
  description: string;
  annotatedSource: string;
  messageId: MessageIds;
  suggestions?: {
    messageId: MessageIds;
    output: string;
    data: { tabindex: string };
  }[];
};

const messageId = 'noPositiveTabindex' as const;
const suggestNonNegativeTabindex = 'suggestNonNegativeTabindex' as const;

const valid = [
  '<span></span>',
  '<span id="2"></span>',
  '<span tabindex></span>',
  '<span tabindex="-1"></span>',
  '<span tabindex="0"></span>',
  '<span [attr.tabindex]="-1"></span>',
  '<span [attr.tabindex]="0"></span>',
  '<span [attr.tabindex]="tabIndex"></span>',
  '<span [attr.tabindex]="null"></span>',
  '<span [attr.tabindex]="undefined"></span>',
  '<app-test [tabindex]="1"></app-test>',
];

const invalid: TabindexTestcase[] = [
  {
    description: 'should fail if `tabindex` attribute is positive',
    annotatedSource: `
      <div tabindex="5"></div>
    `,
    messageId,
    suggestions: [
      {
        messageId: suggestNonNegativeTabindex,
        output: `
          <div tabindex="-1"></div>
        `,
        data: { tabindex: '-1' },
      },
      {
        messageId: suggestNonNegativeTabindex,
        output: `
          <div tabindex="0"></div>
        `,
        data: { tabindex: '0' },
      },
    ],
  },
  {
    description: 'should fail if `tabindex` input is positive',
    annotatedSource: `
      <div [attr.tabindex]="21"></div>
    `,
    messageId,
    suggestions: [
      {
        messageId: suggestNonNegativeTabindex,
        output: `
          <div [attr.tabindex]="-1"></div>
        `,
        data: { tabindex: '-1' },
      },
      {
        messageId: suggestNonNegativeTabindex,
        output: `
          <div [attr.tabindex]="0"></div>
        `,
        data: { tabindex: '0' },
      },
    ],
  },
];

// Helper function to convert annotated source to failure case
function convertAnnotatedSourceToFailureCase(testcase: TabindexTestcase): string {
  return convertAnnotatedSourceToFailureCase(testcase);
}

export { valid, invalid };
