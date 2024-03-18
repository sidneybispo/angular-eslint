import type {
  ParseSourceSpan,
  Comment,
} from '@angular-eslint/bundled-angular-compiler';
import { parseTemplate } from '@angular-eslint/bundled-angular-compiler';
import type { TSESTree } from '@typescript-eslint/types';
import { Scope, ScopeManager } from 'eslint-scope';
import {
  convertElementSourceSpanToLoc,
  convertNodeSourceSpanToLoc,
} from './convert-source-span-to-loc';

type NodeOrTokenType = any;

interface Node {
  [key: string]: any;
  type: NodeOrTokenType;
}

interface VisitorKeys {
  [nodeName: string]: string[];
}

interface Token extends TSESTree.BaseNode {
  type: NodeOrTokenType;
  value: string;
}

interface AST extends Node, Token {
  comments: Token[];
  tokens: Token[];
  templateNodes: any[];
}

const KEYS: VisitorKeys = {
  ASTWithSource: ['ast'],
  Binary: ['left', 'right'],
  BoundAttribute: ['value'],
  BoundEvent: ['handler'],
  BoundText: ['value'],
  Conditional: ['condition', 'trueExp', 'falseExp'],
  Element$1: ['children', 'inputs', 'outputs', 'attributes'],
  Interpolation: ['expressions'],
  PrefixNot: ['expression'],
  Program: ['templateNodes'],
  PropertyRead: ['receiver'],
  Template: ['templateAttrs', 'children', 'inputs'],
  BindingPipe: ['exp'],
};

function isNode(node: unknown): node is Node {
  if (!node) return false;
  return (
    typeof node === 'object' &&
    typeof (node as { type?: unknown }).type === 'string'
  );
}

function isArrayOfNodes(nodes: unknown): nodes is Node[] {
  if (!Array.isArray(nodes)) return false;
  return nodes.every(isNode);
}

function isToken(token: unknown): token is Token {
  if (!token) return false;
  return (
    typeof token === 'object' &&
    typeof token.type === 'string' &&
    typeof token.value === 'string'
  );
}

function fallbackKeysFilter(this: Node, key: string): boolean {
  if (
    key === 'comments' ||
    key === 'leadingComments' ||
    key === 'loc' ||
    key === 'parent' ||
    key === 'range' ||
    key === 'trailingComments' ||
    key === '__originalType'
  ) {
    return false;
  }
  const value = this[key];
  if (value === null || typeof value !== 'object') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.every((v) => typeof v.type === 'string');
  }
  return typeof value.type === 'string';
}

function getFallbackKeys(node: Node): string[] {
  return Object.keys(node).filter(fallbackKeysFilter, node);
}

function preprocessNode(node: Node) {
  const keys = KEYS[node.type] || getFallbackKeys(node);

  if (!node.loc && node.sourceSpan) {
    node.loc = convertNodeSourceSpanToLoc(node.sourceSpan);
  }

  for (const key of keys) {
    const child = node[key];
    if (child === undefined) continue;
    if (child.__originalType) {
      child.type = child.__originalType;
      delete child.__originalType;
    }
    if (Array.isArray(child)) {
      if (isArrayOfNodes(child)) {
        for (const c of child) {
          if (isNode(c)) {
            preprocessNode(c);
          }
        }
      }
    } else if (isNode(child)) {
      preprocessNode(child);
    }
  }
}

function getStartSourceSpanFromAST(ast: AST): ParseSourceSpan | null {
  let startSourceSpan: ParseSourceSpan | null = null;
  ast.templateNodes.forEach((node) => {
    const nodeSourceSpan = node.startSourceSpan || node.sourceSpan;

    if (!startSourceSpan) {
      startSourceSpan = nodeSourceSpan;
      return;
    }

    if (
      nodeSourceSpan &&
      nodeSourceSpan.start.offset < startSourceSpan.start.offset
    ) {
      startSourceSpan = nodeSourceSpan;
      return;
    }
  });
  return startSourceSpan;
}

function getEndSourceSpanFromAST(ast: AST): ParseSourceSpan | null {
  let endSourceSpan: ParseSourceSpan | null = null;
  ast.templateNodes.forEach((node) => {
    const nodeSourceSpan = node.endSourceSpan || node.sourceSpan;

    if (!endSourceSpan) {
      endSourceSpan = nodeSourceSpan;
      return;
    }

    if (
      nodeSourceSpan &&
      nodeSourceSpan.end.offset > endSourceSpan.end.offset
    ) {
      endSourceSpan = nodeSourceSpan;
      return;
    }
  });
  return endSourceSpan;
}

function convertNgAstCommentsToTokens(comments: Comment[]): Token[] {
  return comments.map((comment) => {
    return {
      // In an HTML context, effectively all our comments are Block comments
      type: 'Block',
      value: comment.value,
      loc: convertNodeSourceSpanToLoc(comment.sourceSpan),
      range: [comment.sourceSpan.start.offset, comment.sourceSpan.end.offset],
    } as Token;
  });
}

interface ParseForESLintReturnType {
