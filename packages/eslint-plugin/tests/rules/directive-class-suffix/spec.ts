import { RuleTester } from '@angular-eslint/utils';
import { FormDirective } from './form.directive';
import { TsConfigRuleTester } from '@angular-eslint/utils/testing';
import rule, { RULE_NAME } from '../../src/rules/directive-class-suffix';

describe(RULE_NAME, () => {
  let ruleTester: TsConfigRuleTester;

  beforeEach(() => {
    ruleTester = new TsConfigRuleTester({
      parserOptions: {
        project: './tsconfig.json',
      },
    });
  });

  it('reports violations', () => {
    ruleTester.run(RULE_NAME, rule, {
      invalid: [
        {
          code: `
            @Directive({
              selector: '[appFoo]'
            })
            export class FooDirective {
            }
          `,
          errors: [{ messageId: 'expectedDirectiveClassSuffix', data: { suffix: 'Directive' } }],
        },
      ],
      valid: [
        {
          code: `
            @Directive({
              selector: '[appBar]'
            })
            export class BarDirective {
            }
          `,
        },
        {
          code: `
            @Component({
              selector: 'app-foo',
              template: \`\`
            })
            export class FooComponent {
            }
          `,
        },
        {
          code: `
            @Directive({
              selector: '[appFoo]'
            })
            export class FooFormDirective extends FormDirective {
            }
          `,
        },
      ],
    });
  });
});
