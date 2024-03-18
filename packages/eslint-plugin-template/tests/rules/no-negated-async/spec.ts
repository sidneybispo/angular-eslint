import { RuleTester } from '@angular-eslint/utils';
import rule, { RULE_NAME } from '../../../src/rules/no-negated-async';
import { templateFixture } from './test-utils';

describe(RULE_NAME, () => {
  const ruleTester = new RuleTester({
    parser: '@angular-eslint/template-parser',
  });

  ruleTester.run(RULE_NAME, rule, templateFixture(RULE_NAME, {
    valid: [
      {
        template: `
          <div *ngIf="!isLoading; else loadingTemplate">
            Content
          </div>

          <ng-template #loadingTemplate>
            Loading...
          </ng-template>
        `,
      },
      // Add more valid cases here
    ],
    invalid: [
      {
        template: `
          <div *ngIf="isLoading; else contentTemplate">
          </div>

          <ng-template #contentTemplate>
            Content
          </ng-template>
        `,
        errors: [{ messageId: 'noNegatedAsync' }],
      },
      // Add more invalid cases here
    ],
  }));
});



import { TemplateFixture } from '@angular-eslint/template-parser';

export function templateFixture(ruleName: string, testCases: { valid: any[], invalid
