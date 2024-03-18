import type {
  AST,
  ASTWithSource,
  Interpolation,
  ParseSourceSpan,
  TmplAstIcu,
  TmplAstText,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  TmplAstBoundText,
  TmplAstElement,
} from '@angular-eslint/bundled-angular-compiler';
import type { Message } from '@angular-eslint/i18n-checker';
import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';
import {
  createESLintRule,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import { getNearestNodeFrom } from '@angular-eslint/template-parser';

// ... rest of the code ...

