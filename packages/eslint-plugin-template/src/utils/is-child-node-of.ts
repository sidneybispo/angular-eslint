import { TmplAstElement, TmplAstChildNode } from '@angular-eslint/bundled-angular-compiler';

export function isChildNodeOf(ast: TmplAstElement, childNodeName: string): boolean {
  function traverseChildNodes(nodes: TmplAstChildNode[]): boolean {
    return nodes.some(
      (node): node is TmplAstElement =>
        node instanceof TmplAstElement &&
        (node.name === childNodeName || traverseChildNodes(node.children)),
    );
  }

  return traverseChildNodes(ast.children);
}
