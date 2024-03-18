import {
  ASTUtils,
  convertAnnotatedSourceToFailureCase,
  MessageIds,
} from '@angular-eslint/utils';
import type { Component, Directive, Injectable, NgModule } from '@angular/core';
import type { DoBootstrap } from '@angular/core/src/linker/element_ref';

const messageId: MessageIds = 'useLifecycleInterface';

describe('useLifecycleInterface rule', () => {
  describe('valid cases', () => {
    const valid = [
      `
        class Test implements OnInit {
          ngOnInit() {}
        }
        `,
      `class Test implements DoBootstrap {
          ngDoBootstrap() {}
        }
        `,
      `
        class Test extends Component implements OnInit, OnDestroy  {
          ngOnInit() {}

          private ngOnChanges = '';

          ngOnDestroy() {}

          ngOnSmth() {}
        }
        `,
      `
        class Test extends Component implements ng.OnInit, ng.OnDestroy  {
          ngOnInit() {}

          private ngOnChanges = '';

          ngOnDestroy() {}

          ngOnSmth() {}
        }
        `,
      'class Test {}',
    ];

    valid.forEach(code => {
      it(`should not fail for valid code: ${code}`, () => {
        expect(convertAnnotatedSourceToFailureCase({ annotatedSource: code })).toBeUndefined();
      });
    });
  });

  describe('invalid cases', () => {
    const invalid = [
      {
        description: 'it should fail if lifecycle method is declared without implementing its interface',
        annotatedSource: `
            @Component()
            class Test {
              ngOnInit() {
              ~~~~~~~~
              }
            }
          `,
        messageId,
        data: {
          interfaceName: ASTUtils.AngularLifecycleInterfaces.OnInit,
          methodName: ASTUtils.AngularLifecycleMethods.ngOnInit,
        },
      },
      {
        description: 'it should fail if one of the lifecycle methods is declared without implementing its interface',
        annotatedSource: `
            @Directive()
            class Test extends Component implements OnInit {
              ngOnInit() {}

              ngOnDestroy() {
              ~~~~~~~~~~~
              }
            }
          `,
        messageId,
        data: {
          interfaceName: ASTUtils.AngularLifecycleInterfaces.OnDestroy,
          methodName: ASTUtils.AngularLifecycleMethods.ngOnDestroy,
        },
      },
      {
        description: 'it should fail if lifecycle methods are declared without implementing their interfaces',
        annotatedSource: `
            @Injectable()
            class Test {
              ngDoBootstrap() {}
              ~~~~~~~~~~~~~

              ngOnInit() {}
              ^^^^^^^^

              ngOnDestroy() {}
              ###########
            }
          `,
        messages: [
          {
            char: '~',
            messageId,
            data: {
              interfaceName: ASTUtils.AngularLifecycleInterfaces.DoBootstrap,
              methodName: ASTUtils.AngularLifecycleMethods.ngDoBootstrap,
            },
          },
          {
            char: '^',
            messageId,
            data: {
              interfaceName: ASTUtils.AngularLifecycleInterfaces.OnInit,
              methodName: ASTUtils.AngularLifecycleMethods.ngOnInit,
            },
          },
          {
            char: '#',
            messageId,
            data: {
              interfaceName: ASTUtils.AngularLifecycleInterfaces.OnDestroy,
              methodName: ASTUtils.AngularLifecycleMethods.ngOnDestroy,
            },
          },
        ],
      },
      {
        description: 'it should fail if lifecycle methods are declared without implementing their interfaces, using namespace',
        annotatedSource: `
            @NgModule()
            class Test extends Component implements ng.OnInit {
              ngOnInit() {}

              ngOnDestroy() {
              ~~~~~~~~~~~
              }
            }
          `,
        messageId,
        data: {
          interfaceName: ASTUtils.AngularLifecycleInterfaces.OnDestroy,
          methodName: ASTUtils.AngularLifecycleMethods.ngOnDestroy,
        },
      },
    ];

    invalid.forEach(({ description, annotatedSource, messageId, data, messages }) => {
      it(description, () => {
        const failureCase = convertAnnotatedSourceToFailureCase({
          annotatedSource,
          messageId,
          data,
          messages,
        });
        expect(failureCase).toBeDefined();
      });
    });
  });
});

