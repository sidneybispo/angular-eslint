import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/no-output-on-prefix';

const messageId: MessageIds = 'noOutputOnPrefix';

export const validExamples = [
  `class Test {}`,
  `
    @Component({
      outputs: ['on', 'onChange', 'onLine', 'on:on2', 'offline:on', ...onCheck, 'onOutput()'],
    })
    class Test {}
    `,
  `
    @Component()
    class Test {
      @Output() on = new EventEmitter();
    }
    `,
  `
    @Directive()
    class Test {
      @Output() buttonChange = new EventEmitter<'on'>();
    }
    `,
  `
    @Component()
    class Test {
      @Output() On = new EventEmitter<{ on: string }>();
    }
    `,
  `
    @Directive()
    class Test {
      @Output('one') ontype = new EventEmitter<{ bar: string, on: boolean }>();
    }
    `,
  `
    @Component()
    class Test {
      @Output('oneProp') common = new EventEmitter<ComplexOn>();
    }
    `,
  `
    @Directive<On>()
    class Test {
      @Output() ON = new EventEmitter<On>();
    }
    `,
  `
    const on = 'on';
    @Component()
    class Test {
      @Output(on) touchMove = new EventEmitter<{ action: 'on' | 'off' }>();
    }
    `,
  `
    const test = 'on';
    const on = 'on';
    @Directive()
    class Test {
      @Output(test) [on]: EventEmitter<OnTest>;
    }
    `,
  `
    @Component({
      selector: 'foo',
      outputs: [\`test: ${'foo'}\`]
    })
    class Test {}
    `,
  `
    @Directive({
      selector: 'foo',
      outputs: [\`test: ${'foo'}\`]
    })
    class Test {}
    `,
  `
    @Component({
      selector: 'foo',
      outputs: [\`test: ${'foo'}\`]
    })
    class Test {}
    `,
  `
    @Directive({
      selector: 'foo',
    })
    class Test {
      @Output() get 'getter'() {}
    }
    `,
];

export const invalidExamples = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if `outputs` metadata property is named "on" in `@Component`',
    annotatedSource: `
        @Component({
          outputs: ['on']
                    ~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if `outputs` metadata property is `Literal` and aliased as "on" in `@Directive`',
    annotatedSource: `
        @Directive({
          inputs: [onCredit],
          outputs: [onLevel, \`test: on\`, onFunction()],
                               ~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if `outputs` metadata property is computed `Literal` and named "onTest" in `@Component`',
    annotatedSource: `
        @Component({
          outputs: ['onTest: test', ...onArray],
                        ~~~~~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if `outputs` metadata property is computed `TemplateLiteral` and named "onTest" in `@Directive`',
    annotatedSource: `
        @Directive({
          outputs: ['onTest: test', ...onArray],
                        ~~~~~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if output property is named "on" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Output() on: EventEmitter<any> = new EventEmitter<{}>();
                    ~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if output property is named with "\'on\'" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          @Output() 'onPrefix' = new EventEmitter<void>();
                                  ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if output property is aliased as "on" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Output() on = getOutput();
                   ~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if output property is aliased with "on" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          @Output('onPrefix') _on = (this.subject$ as Subject<{on: boolean}>).pipe();
                  ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if output getter is named with "on" prefix in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Output('getter') get 'on-getter'() {}
                                ~~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceTo
