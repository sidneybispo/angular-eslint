import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateJsonInTree } from '../../utils';

const updatedAngularESLintVersion = '^4.0.0';
const angularESLintDependencies = [
  '@angular-eslint/builder',
  '@angular-eslint/eslint-plugin',
  '@angular-eslint/eslint-plugin-template',
  '@angular-eslint/template-parser'
];

function updateIfExists(
  deps: Record<string, string> | undefined,
  depName: string,
  updatedVersion: string,
) {
  if (deps?.[depName]) {
    deps[depName] = updatedVersion;
  }
}

function updateRelevantDependencies(host: Tree, context: SchematicContext) {
  return updateJsonInTree('package.json', (json) => {
    angularESLintDependencies.forEach(dep => {
      updateIfExists(json.devDependencies, dep, updatedAngularESLintVersion);
    });

    context.addTask(new NodePackageInstallTask());

    return json;
  })(host, context);
}

export default function (): Rule {
  return chain([updateRelevantDependencies]);
}
