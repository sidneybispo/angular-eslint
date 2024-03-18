import type {
  TSESLint,
  TSESTree,
  RuleFixer,
  SourceCode,
  TSClassImplements,
  ClassDeclaration,
  Decorator,
  CallExpression,
  ObjectExpression,
  Node,
} from '@typescript-eslint/experimental-utils';
import {
  ASTUtils,
  getCorrespondentImportClause,
  getImportDeclarations,
  getImportDeclarationSpecifier,
  getInterface,
  isCallExpression,
  isImplementsToken,
  isImportDefaultSpecifier,
  isObjectExpression,
} from './ast-utils';
import { getLast } from '../utils';

type ImportAddParams = {
  compatibleWithTypeOnlyImport?: boolean;
  fixer: RuleFixer;
  importName: string;
  moduleName: string;
  node: Node;
};

export function getImportAddFix({
  compatibleWithTypeOnlyImport = false,
  fixer,
  importName,
  moduleName,
  node,
}: ImportAddParams): RuleFix | undefined {
  const fullImport = `import { ${importName} } from '${moduleName}';\n`;
  const importDeclarations = getImportDeclarations(node, moduleName);

  if (!importDeclarations?.length) {
    return fixer.insertTextAfterRange([0, 0], fullImport);
  }

  const importDeclarationSpecifier = getImportDeclarationSpecifier(
    importDeclarations,
    importName,
  );

  if (importDeclarationSpecifier) {
    return undefined;
  }

  const importClause = getCorrespondentImportClause(
    importDeclarations,
    compatibleWithTypeOnlyImport,
  );

  if (!importClause) {
    return fixer.insertTextAfterRange([0, 0], fullImport);
  }

  const replacementText = isImportDefaultSpecifier(importClause)
    ? `, { ${importName} }`
    : `, ${importName}`;
  return fixer.insertTextAfter(importClause, replacementText);
}

type ImportRemoveParams = {
  sourceCode: SourceCode;
  importDeclarations: readonly ImportDeclaration[];
  importName: string;
  fixer: RuleFixer;
};

export function getImportRemoveFix({
  sourceCode,
  importDeclarations,
  importName,
  fixer,
}: ImportRemoveParams): RuleFix | undefined {
  const { importDeclaration, importSpecifier } =
    getImportDeclarationSpecifier(importDeclarations, importName) ?? {};

  if (!importDeclaration || !importSpecifier) return undefined;

  const isFirstImportSpecifier =
    importDeclaration.specifiers[0] === importSpecifier;
  const isLastImportSpecifier =
    getLast(importDeclaration.specifiers) === importSpecifier;
  const isSingleImportSpecifier =
    isFirstImportSpecifier && isLastImportSpecifier;

  if (isSingleImportSpecifier) {
    return fixer.remove(importDeclaration);
  }

  const tokenAfterImportSpecifier = sourceCode.getTokenAfter(importSpecifier);

  if (isFirstImportSpecifier && tokenAfterImportSpecifier) {
    return fixer.removeRange([
      importSpecifier.range[0],
      tokenAfterImportSpecifier.range[1],
    ]);
  }

  const tokenBeforeImportSpecifier = sourceCode.getTokenBefore(importSpecifier);

  if (!tokenBeforeImportSpecifier) return undefined;

  return fixer.removeRange([
    tokenBeforeImportSpecifier.range[0],
    importSpecifier.range[1],
  ]);
}

type ImplementsSchemaParams = {
  id: ClassDeclaration['id'];
  implements: TSClassImplements;
};

export function getImplementsSchemaFixer({
  id,
  implements: classImplements,
}: ImplementsSchemaParams): {
  readonly implementsNodeReplace:
    | TSClassImplements
    | Identifier;
  readonly implementsTextReplace: string;
} {
  const [implementsNodeReplace, implementsTextReplace] = classImplements
    ? [getLast(classImplements), `, ${interfaceName}`]
    : [id as Identifier, ` implements ${interfaceName}`];

  return { implementsNodeReplace, implementsTextReplace } as const;
}

type DecoratorPropertyAddParams = {
  expression: Decorator['expression'];
  fixer: RuleFixer;
  text: string;
};

export function getDecoratorPropertyAddFix({
  expression,
  fixer,
  text,
}: DecoratorPropertyAddParams): RuleFix | undefined {
  if (!isCallExpression(expression)) {
    return undefined;
  }

  const [firstArgument] = expression.arguments;

  if (!firstArgument || !isObjectExpression(firstArgument)) {
    // `@Component()` => `@Component({changeDetection: ChangeDetectionStrategy.OnPush})`
    const [initialRange, endRange] = expression.range;
    return fixer.insertTextAfterRange(
      [initialRange + 1, endRange - 1],
      `{${text}}`,
    );
  }

  const { properties } = firstArgument;

  if (properties.length === 0) {
    //` @Component({})` => `@Component({changeDetection: ChangeDetectionStrategy.OnPush})`
    const [initialRange, endRange] = firstArgument.range;
    return fixer.insertTextAfterRange([initialRange + 1, endRange - 1], text);
  }

  // `@Component({...})` => `@Component({changeDetection: ChangeDetectionStrategy.OnPush, ...})`
  return fixer.insertTextBefore(properties[0], `${text},`);
}

type ImplementsRemoveParams = {
  sourceCode: SourceCode;
  classDeclaration: ClassDeclaration;
  interfaceName: string
