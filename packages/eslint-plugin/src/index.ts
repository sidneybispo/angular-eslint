import all from './configs/all.json';
import base from './configs/base.json';
import recommended from './configs/recommended.json';
import recommendedExtra from './configs/recommended--extra.json';
import ngCliCompat from './configs/ng-cli-compat.json';
import ngCliCompatFormattingAddOn from './configs/ng-cli-compat--formatting-add-on.json';

const rules = {
  contextualDecorator,
  componentClassSuffix,
  componentMaxInlineDeclarations,
  componentSelector,
  contextualLifecycle,
  directiveClassSuffix,
  directiveSelector,
  noAttributeDecorator,
  noConflictingLifecycle,
  noForwardRef,
  noHostMetadataProperty,
  noInputPrefix,
  noInputRename,
  noInputsMetadataProperty,
  noLifecycleCall,
  noOutputNative,
  noOutputOnPrefix,
  noOutputRename,
  noOutputsMetadataProperty,
  noPipeImpure,
  noQueriesMetadataProperty,
  noEmptyLifecycleMethod,
  preferOnPushComponentChangeDetection,
  preferOutputReadonly,
  relativeUrlPrefix,
  sortNgmoduleMetadataArrays,
  useComponentSelector,
  useComponentViewEncapsulation,
  useInjectableProvidedIn,
  useLifecycleInterface,
  usePipeTransformInterface,
  pipePrefix,
};

const ruleNames = Object.keys(rules);

export default {
  configs: {
    all,
    base,
    recommended,
    'recommended--extra': recommendedExtra,
    'ng-cli-compat': ngCliCompat,
    'ng-cli-compat--formatting-add-on': ngCliCompatFormattingAddOn,
  },
  rules,
  ruleNames,
};
