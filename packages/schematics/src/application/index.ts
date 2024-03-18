import {
  chain,
  externalSchematic,
  MergeStrategy,
  noop,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { Schema as ApplicationSchema } from '@schematics/angular/application/schema';
import {
  addESLintTargetToProject,
  createESLintConfigForProject,
  removeTSLintJSONForProject,
} from '../utils';

function eslintRelatedChanges(options: ApplicationSchema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      addESLintTargetToProject(options.name, 'lint'),
      createESLintConfigForProject(options.name),
      removeTSLintJSONForProject(options.name),
    ])(host, context);
  };
}

export default function (options: ApplicationSchema): Rule {
  if (!options.name) {
    return noop();
  }

  return (host: Tree, context: SchematicContext) => {
    return chain([
      externalSchematic('@schematics/angular', 'application', options, {
        dryRun: false,
        mergeStrategy: MergeStrategy.Overwrite,
      }).catch((error) => {
        context.logger.error(error);
        return;
      }),
      eslintRelatedChanges(options),
    ])(host, context);
  };
}
