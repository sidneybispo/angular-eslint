import {
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { Schema as LibrarySchema } from '@schematics/angular/library/schema';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addESLintTargetToProject,
  createESLintConfigForProject,
  removeTSLintJSONForProject,
} from '../utils';

function eslintRelatedChanges(projectName: string): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      addESLintTargetToProject(projectName, 'lint'),
      createESLintConfigForProject(projectName),
      removeTSLintJSONForProject(projectName),
    ])(host, context);
  };
}

export default function (options: LibrarySchema): Rule {
  const projectName = options.name;

  return (host: Tree, context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'library', options)(host, context)
      .pipe(
        mergeWith(
          eslintRelatedChanges(projectName),
          MergeStrategy.Overwrite
        )
      );
  };
}

// Add this function to install the required dev dependencies
function installDependencies() {
  return () => {
    const tasks: NodePackageInstallTask[] = [
      {
        name: 'eslint',
        url: 'https://www.npmjs.com/package/eslint',
      },
      {
        name: 'eslint-plugin-angular',
        url: 'https://www.npmjs.com/package/eslint-plugin-angular',
      },
      {
        name: 'eslint-plugin-jasmine',
        url: 'https://www.npmjs.com/package/eslint-plugin-jasmine',
      },
      {
        name: 'eslint-plugin-jest',
        url: 'https://www.npmjs.com/package/eslint-plugin-jest',
      },
      {
        name: 'eslint-plugin
