import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { ARIARoleRelationConcept } from 'aria-query';
import { attributesComparator } from '../attributes-comparator';
import {
  getDomElements,
  getInteractiveElementAXObjectSchemas,
  getInteractiveElementRoleSchemas,
  getNonInteractiveElementRoleSchemas,
} from '../dom-helpers';

interface ElementSchemaMatcher {
  (schema: ARIARoleRelationConcept): boolean;
}

function checkIsInteractiveElement(node: TmplAstElement, matcher: ElementSchemaMatcher): boolean {
  return (
    matcher({
      attributes: node.attributes,
      name: node.name,
    }) ||
    !getNonInteractiveElementRoleSchemas().some(matcher)
  );
}

/**
 * Returns boolean indicating whether the given element is
 * interactive on the DOM or not. Usually used when an element
 * has a dynamic handler on it and we need to discern whether or not
 * it's intention is to be interacted with on the DOM.
 */
export function isInteractiveElement(node: TmplAstElement): boolean {
  const matcher = (schema: ARIARoleRelationConcept) =>
    getInteractiveElementRoleSchemas().some(schema) ||
    getInteractiveElementAXObjectSchemas().some(schema);

  return (
    getDomElements().has(node.name) &&
    checkIsInteractiveElement(node, matcher)
  );
}
