import { RuleTester } from '@angular-eslint/utils';
import { parseSource } from '@angular-eslint/template-parser';
import rule, { RULE_NAME } from '../../../src/rules/no-inputs-metadata-property';

import { invalid, valid } from './cases';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      code: valid,
    },
    {
      template: `
        <app-my-component [someInput]="someValue"></app-my-component>
      `,
      templateSyntax: parseSource(`
        <app-my-component [someInput]="someValue"></app-my-component>
      `),
    },
  ].filter(Boolean),
  invalid: invalid.map(({ code, errors }) => ({
    code,
    errors: errors.map((error) => ({ ...error, messageId: error.messageId.replace('noInputsMetadataProperty', RULE_NAME) })),
  })),
});
