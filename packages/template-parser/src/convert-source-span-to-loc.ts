import type {
  Node,
  ParseSourceSpan,
  TmplAstElement,
} from '@angular-eslint/bundled-angular-compiler';
import {
  Element,
  getHtmlTagDefinition,
  HtmlParser,
} from '@angular-eslint/bundled-angular-compiler';
import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils';

export function convertNodeSourceSpanToLoc(
  sourceSpan: ParseSourceSpan,
): TSESTree.SourceLocation {
  return {
    start: {
      line: sourceSpan.start.line + 1,
      column: sourceSpan.start.col,
    },
    end: {
      line: sourceSpan.end.line + 1,
      column: sourceSpan.end.col,
    },
  };
}

export function convertElementSourceSpanToLoc(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
  node: TmplAstElement,
): TSESTree.SourceLocation {
  if (node.type !== 'Element$1') {
    throw new Error(
      'convertElementSourceSpanToLoc is intended to be used only with elements.',
    );
  }

  if (getHtmlTagDefinition(node.name).isVoid) {
    const matchingNode = tryToFindTheVoidNodeThatMatchesTheSourceSpan(context, node) || node;
    return convertNodeSourceSpanToLoc(matchingNode.sourceSpan);
  }

  return convertNodeSourceSpanToLoc(node.sourceSpan);
}

function tryToFindTheVoidNodeThatMatchesTheSourceSpan(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
  node: TmplAstElement,
): Node | null {
  const parser = getHtmlParser();
  if (!parser) {
    throw new Error('Failed to initialize HtmlParser instance.');
  }

  const { rootNodes } = parser.parse(
    context.getSourceCode().getText(),
    context.getFilename(),
  );

  return lookupTheVoidNode(rootNodes, node.sourceSpan);
}

function lookupTheVoidNode(
  rootNodes: Node[],
  sourceSpan: ParseSourceSpan,
): Node | null {
  for (const node of rootNodes) {
    if (
      node.sourceSpan.start.line === sourceSpan.start.line &&
      node.sourceSpan.start.offset === sourceSpan.start.offset
    ) {
      return node;
    }

    if (node instanceof Element) {
      const voidNodeBeingLookedUp = lookupTheVoidNode(
        node.children,
        sourceSpan,
      );

      if (voidNodeBeingLookedUp !== null) {
        return voidNodeBeingLookedUp;
      }
    }
  }

  return null;
}

let htmlParser: HtmlParser | null = null;

function getHtmlParser(): HtmlParser {
  return htmlParser || (htmlParser = new HtmlParser());
}
