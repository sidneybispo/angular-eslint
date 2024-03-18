import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/accessibility-table-scope';

type TestCase = [string, string?];

const messageId: MessageIds = 'accessibilityTableScope';

const valid: TestCase[] = [
  ['<th></th>'],
  ['<th scope="col"></th>'],
  ['<th [scope]="\'col\'"></th>'],
  ['<th [attr.scope]="scope"></th>'],
  ['<div scope="col"></div>'],
  ['<button [appscope]="col"></button>'],
  ['<app-table scope></app-table>'],
  ['<app-row [scope]="row"></app-row>'],
];

const invalid: TestCase[] = [
  [
    '{{ test }}<div scope></div>',
    'should fail if `scope` attribute is not on `th` element',
    '{{ test }}<div></div>',
  ],
  [
    '<div [attr.scope]="scope"></div><p></p>',
    'should fail if `scope` input is not on `th` element',
    '<div></div><p></p>',
  ],
];

invalid.forEach(([input, description, output]) => {
  convertAnnotatedSourceToFailureCase({
    description,
    annotatedSource: `{{ test }}${input}`,
    messageId,
    annotatedOutput: `{{ test }}${output}`,
  });
});
