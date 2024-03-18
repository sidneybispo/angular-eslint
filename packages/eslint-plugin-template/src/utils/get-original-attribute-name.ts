import {
  TmplAstBoundAttribute,
  TmplAstBoundEvent,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';

/**
 * Returns the original attribute name.
 * @example
 * ```html
 * <div [style.display.none]="test"></div> <!-- Instead of "style.display.none", "display" -->
 * <div [attr.role]="'none'"></div> <!-- Instead of "attr.role", "role" -->
 * <div ([ngModel])="test"></div> <!-- Instead of "ngModel", "ngModelChange" -->
 * <div (@fade.start)="handle()"></div> <!-- Instead of "fade", "@fade.start" -->
 * ```
 */
export function getOriginalAttributeName(
  attribute: TmplAstBoundAttribute | TmplAstBoundEvent | TmplAstTextAttribute,
): string {
  if (attribute instanceof TmplAstBoundEvent) {
    return isTwoWayDataBinding(attribute) ? attribute.name.slice(0, -7) : attribute.name.slice(1);
  }

  const { details } = attribute.keySpan ?? {};
  return details ?? attribute.name;
}

function isTwoWayDataBinding(attribute: TmplAstBoundEvent): boolean {
  const { name, keySpan } = attribute;
  return keySpan && keySpan.details && name.endsWith('Change');
}
