import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateJsonInTree } from '../../utils';

export function updateDependencies(
  depsToUpdate: { packageName: string; version: string; type?: 'dependencies' | 'devDependencies' }[],
): Rule {
  return chain(depsToUpdate.map((dep) => {
    return updateJsonInTree(`package.json`, (json) => {
      updateIfExists(json, dep.packageName, dep.version, dep.type);
      return json;
    });
  })).pipe(addPackageInstallTask());
}

function updateIfExists(
  packageJson:
    | {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      }
    | undefined,
  depName: string,
  updatedVersion: string,
  type?: 'dependencies' | 'devDependencies',
) {
  if (!packageJson || !type) {
    return;
  }
  if (packageJson[type] && packageJson[type][depName]) {
    packageJson[type][depName] = updatedVersion;
  }
}

function addPackageInstallTask(): (tree: Tree, context: SchematicContext) => void {
  return (_: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  };
}
