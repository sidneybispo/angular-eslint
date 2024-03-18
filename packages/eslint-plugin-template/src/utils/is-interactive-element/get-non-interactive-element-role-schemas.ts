import type { ARIARoleDefinitionKey, ARIARoleRelationConcept } from "aria-query";
import { elementRoles, roles } from "aria-query";

let nonInteractiveElementRoleSchemas: ARIARoleRelationConcept[] | null = null;

export function getNonInteractiveElementRoleSchemas(): ARIARoleRelationConcept[] {
  if (nonInteractiveElementRoleSchemas === null) {
    const nonInteractiveRoles = new Set<ARIARoleDefinitionKey>([
      ...roles.keys()].filter((name) => {
      const role = roles.get(name);
      return role &&
        !role.abstract &&
        name !== 'toolbar' &&
        !['widget', 'landmark', 'range'].some((superClass) => role.superClass.includes(superClass));
    }}).concat('progressbar'));

    nonInteractiveElementRoleSchemas = elementRoles.flatMap(([elementSchema, roleSet]) =>
      roleSet.every(role => nonInteractiveRoles.has(role)) ? elementSchema : []
    );
  }

  return nonInteractiveElementRoleSchemas;
}
