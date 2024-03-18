import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain, schematic } from '@angular-devkit/schematics';
import {
  getTargetsConfigFromProject,
  readJsonInTree,
  sortObjectByKeys,
  updateJsonInTree,
} from '../utils';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

const packageJSON = require('../../package.json');

interface PackageJson {
  devDependencies?: {
    [key: string]: string;
  };
  scripts?: {
    [key: string]: string;
  };
}

function addAngularESLintPackages(host: Tree): void {
  if (!host.exists('package.json')) {
    throw new Error(
      'Could not find a `package.json` file at the root of your workspace',
    );
  }

  if (host.exists('tsconfig.base.json')) {
    throw new Error(
      '\nError: Angular CLI v10.1.0 and later (and no `tsconfig.base.json`) is required in order to run this schematic. Please update your workspace and try again.\n',
    );
  }

  const projectPackageJSON = (host.read('package.json') as Buffer).toString(
    'utf-8',
  );
  const json: PackageJson = JSON.parse(projectPackageJSON);

  json.devDependencies = json.devDependencies || {};
  json.devDependencies['eslint'] = `^${packageJSON.devDependencies['eslint']}`;
  json.scripts = json.scripts || {};
  json.scripts['lint'] = json.scripts['lint'] || 'ng lint';

  json.devDependencies['@angular-eslint/builder'] = packageJSON.version;
  json.devDependencies['@angular-eslint/eslint-plugin'] = packageJSON.version;
  json.devDependencies['@angular-eslint/eslint-plugin-template'] =
    packageJSON.version;
  if (json.dependencies?.['@angular-eslint/schematics']) {
    delete json.dependencies['@angular-eslint/schematics'];
  }
  json.devDependencies['@angular-eslint/schematics'] = packageJSON.version;
  json.devDependencies['@angular-eslint/template-parser'] =
    packageJSON.version;

  const typescriptESLintVersion =
    packageJSON.devDependencies['@typescript-eslint/experimental-utils'];
  json.devDependencies['@typescript-eslint/eslint-plugin'] =
    typescriptESLintVersion;
  json.devDependencies['@typescript-eslint/parser'] = typescriptESLintVersion;

  json.devDependencies = sortObjectByKeys(json.devDependencies);
  host.overwrite('package.json', JSON.stringify(json, null, 2));
}

function applyESLintConfigIfSingleProjectWithNoExistingTSLint(host: Tree): void {
  const angularJson = readJsonInTree(host, 'angular.json');
  if (!angularJson || !angularJson.projects) {
    return;
  }
  const projectNames = Object.keys(angularJson.projects);
  if (projectNames.length !== 1) {
    return;
  }

  const singleProject = angularJson.projects[projectNames[0]];
  const targetsConfig = getTargetsConfigFromProject(singleProject);
  if (!targetsConfig) {
    return;
  }

  if (targetsConfig.lint) {
    return;
  }

  addEslintToProject(host);

  updateJsonInTree('angular.json', (json) => {
    json.cli = json.cli || {};
    json.cli.defaultCollection = '@angular-eslint/schematics';
    return json;
  });
}

function addEslintToProject(host: Tree): void {
  const projectName = Object.keys(
    readJsonInTree(host, 'angular.json').projects,
  )[0];
  schematic('add-eslint', {
    project: projectName,
  })(host, {} as SchematicContext);
}

export default function (): Rule {
  return (host: Tree, context: SchematicContext) => {
    addAngularESLintPackages(host);
    applyESLintConfigIfSingleProjectWithNoExistingTSLint(host);
    context.addTask(new NodePackageInstallTask());

    context.logger.info(`
All @angular-eslint dependencies have been successfully installed 🎉

Please see https://github.com/angular-eslint/angular-eslint for how to add ESLint configuration to your project.
`);

    return host;
  };
}
