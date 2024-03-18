import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/use-pipe-transform-interface';
import { Pipe, PipeTransform } from '@angular/core';

const messageId: MessageIds = 'usePipeTransformInterface';

export const valid = [
  `
    @Component({ template: 'test' })
    class Test {}
    `,
  `
    @Pipe({ name: 'test' })
    class Test implements PipeTransform {
      transform(value: string) {}
    }
    `,
  `
    @OtherDecorator() @Pipe({ name: 'test' })
    class Test implements PipeTransform {
      transform(value: string) {}
    }
    `,
  `
    @Pipe({ name: 'test' })
    class Test implements ng.PipeTransform {
      transform(value: string) {}
    }
    `,
  `
    @Pipe({ name: 'test' })
    class Test implements PipeTransform, AnotherInterface {
      transform(value: string) {}
    }
    `,
];

export const invalid = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if a `Pipe` has no interface implemented',
    annotatedSource: `
        @Pipe({ name: 'test' })
        class Test {
              ~~~~
          transform(value: string) {}
        }
      `,
    messageId,
    annotatedOutput: `import { PipeTransform } from '@angular/core';

        @Pipe({ name: 'test' })
        class Test implements PipeTransform {
              ~~~~
          transform(value: string) {}
        }
      `,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if a `Pipe` implements a non-PipeTransform interface',
    annotatedSource: `
        import { HttpClient } from '@angular/common/http';
        import type { PipeTransform } from '@angular/core';
        import { Component,
          Pipe,
          Directive } from '@angular/core';

        @Pipe({ name: 'test' })
        class Test implements HttpClient {
              ~~~~
          transform(value: string) {}
        }
      `,
    messageId,
    annotatedOutput: `
        import { HttpClient } from '@angular/common/http';
        import type { PipeTransform } from '@angular/core';
        import { Component,
          Pipe,
          Directive } from '@angular/core';

        @Pipe({ name: 'test' })
        class Test implements HttpClient, PipeTransform {
              ~~~~
          transform(value: string) {}
        }
      `,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if a `Pipe` implements multiple interfaces, but not the `PipeTransform`',
    annotatedSource: `
        import type { OnInit } from '@angular/core';

        @OtherDecorator() @Pipe({ name: 'test' })
        class Test implements OnInit {
              ~~~~
          transform(value: string) {}
        }
      `,
    messageId,
    annotatedOutput: `
        import type { OnInit, PipeTransform } from '@angular/core';

        @OtherDecorator() @Pipe({ name: 'test' })
        class Test implements OnInit, PipeTransform {
              ~~~~
          transform(value: string) {}
        }
      `,
  }),
];
