import { RuleTester } from '@angular-eslint/utils';
import { parseSource } from '@angular-eslint/template-parser';
import rule, { RULE_NAME } from '../../../src/rules/no-queries-metadata-property';

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
      code: `
        @Component({
          selector: 'app-example',
          template: \`
            <div [innerHtml]="exampleHtml | safe: 'html'"></div>
          \`,
        })
        class ExampleComponent {
          exampleHtml = '<p>Example HTML</p>';
        }
      `,
    },
  ].map((testCase) => ({
    ...testCase,
    template: parseSource(testCase.code).templates[0],
  })),
  invalid: [
    {
      code: invalid,
      errors: [{ messageId: 'noQueriesMetadataProperty' }],
    },
  ].map((testCase) => ({
    ...testCase,
    template: parseSource(testCase.code).templates[0],
  })),
});
