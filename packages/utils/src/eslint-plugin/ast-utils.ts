import type { TSESTree } from '@typescript-eslint/experimental-utils';
import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
} from '@typescript-eslint/experimental-utils';
import { keyof } from 'ts-essentials';

export enum AngularClassDecorators {
  Component = 'Component',
  Directive = 'Directive',
  Injectable = 'Injectable',
  NgModule = 'NgModule',
  Pipe = 'Pipe',
}

// ... other enums ...

export const AngularInnerClassDecorators = {
  ...AngularConstructorParameterDecorators,
  ...AngularMethodDecorators,
  ...AngularPropertyAccessorDecorators,
};

// ... other types ...

export const angularClassDecoratorKeys = [
  AngularClassDecorators.Component,
  AngularClassDecorators.Directive,
  AngularClassDecorators.Injectable,
  AngularClassDecorators.NgModule,
  AngularClassDecorators.Pipe,
] as const;

// ... other readonly collections ...

export const ANGULAR_CLASS_DECORATOR_LIFECYCLE_METHOD_MAPPER: ReadonlyMap<
  keyof typeof AngularClassDecorators,
  ReadonlySet<keyof typeof AngularLifecycleMethods>
> = new Map([
  [
    AngularClassDecorators.Component,
    new Set([
      AngularLifecycleMethods.ngAfterContentChecked,
      AngularLifecycleMethods.ngAfterContentInit,
      AngularLifecycleMethods.ngAfterViewChecked,
      AngularLifecycleMethods.ngAfterViewInit,
      AngularLifecycleMethods.ngOnChanges,
      AngularLifecycleMethods.ngOnDestroy,
      AngularLifecycleMethods.ngOnInit,
      AngularLifecycleMethods.ngDoCheck,
    ]),
  ],
  // ... other entries ...
]);

// ... other readonly sets ...

export const ANGULAR_CLASS_DECORATOR_MAPPER: ReadonlyMap<
  keyof typeof AngularClassDecorators,
  ReadonlySet<keyof typeof AngularInnerClassDecorators>
> = new Map([
  [AngularClassDecorators.Component, ANGULAR_INNER_CLASS_DECORATORS],
  // ... other entries ...
]);

// ... other functions ...

function getCorrespondentImportClause(
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  compatibleWithTypeOnlyImport = false,
): TSESTree.ImportClause | undefined {
  // ... function body ...
}

// ... other functions ...

function isImportedFrom(
  identifier: TSESTree.Identifier,
  moduleName: string,
): boolean {
  // ... function body ...
}

// ... other functions ...

function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  // ... function body ...
}

// ... other type guards ...

