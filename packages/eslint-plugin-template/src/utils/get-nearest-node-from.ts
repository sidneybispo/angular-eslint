import type { AST, R3_Node as Node } from '@angular-eslint/bundled-angular-compiler';
import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/types';

type ASTOrNodeWithParent = (AST | Node) & { parent?: ASTOrNodeWithParent };

function isProgram(node: unknown): node is TSESTree.Program {
  return (node as { type?: string }).type === AST_NODE_TYPES.Program;
}

function getNearestParent<T extends ASTOrNodeWithParent>(
  node: ASTOrNodeWithParent,
  predicate: (parent: ASTOrNodeWithParent) => parent is T,
): T | null {
  let currentNode: ASTOrNodeWithParent | null = node.parent;

  while (currentNode && !isProgram(currentNode)) {
    if (predicate(currentNode)) {
      return currentNode;
    }

    currentNode = currentNode.parent;
  }

  return null;
}

// Usage example:
const nearestTemplateNode = getNearestParent(templateNode, (node): node is Node.Template => node.kind === 'template');
