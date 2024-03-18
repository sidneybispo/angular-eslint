import { RuleTester } from '@angular-eslint/utils';
import rule, { RULE_NAME } from '../../../src/rules/conditional-complexity';
import { templateStringTo Ast } from '@angular-eslint/template-parser';

const ruleTester = new RuleTester({
  parserOptions: {
    parser: '@angular-eslint/template-parser',
  },
});

const parseTemplate = (template: string) => templateStringTo Ast(template);

const validTemplate = `
  <div *ngIf="condition; else elseBlock">
    Content to render when condition is true
  </div>
  <ng-template #elseBlock>
    Content to render when condition is false
  </ng-template>
`;

const invalidTemplate = `
  <div *ngIf="complexCondition1 && complexCondition2 || complexCondition3; else elseBlock">
    Content to render when complex condition is true
  </div>
  <ng-template #elseBlock>
    Content to render when complex condition is false
  </ng-template>
`;

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: parseTemplate(validTemplate),
    },
  ],
  invalid: [
    {
      code: parseTemplate(invalidTemplate),
      errors: [{ messageId: 'tooComplex', data: { maxNesting: 1 } }],
    },
  ],
});
