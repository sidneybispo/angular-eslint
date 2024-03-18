import {
  ASTUtils,
  Selectors,
  toHumanReadableText,
} from '@angular-eslint/utils';
import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { createESLintRule } from '../utils/create-eslint-rule';
import {
  AST_LITERAL_NODE_TYPES,
  AST_TEMPLATE_ELEMENT_NODE_TYPES,
  AST_TEMPLATE_LITERAL_NODE_TYPES,
  AST_TEMPLATE_NODE_TYPES,
} from '@angular-eslint/template-ast';

type Options = [{ readonly prefixes: readonly string[] }];
export type MessageIds = 'noInputPrefix';
export const RULE_NAME = 'no-input-prefix';


