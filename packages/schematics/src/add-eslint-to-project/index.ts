import type { Rule, Tree } from '@angular-devkit/schematics';
import { chain, mergeWith, apply, templates, move } from '@angular-devkit/schematics';
import { addDeclarations, addDependencies, addProvider, addTestProvider, addWwwRootProviders, configureNgProject, mergeJson, removeItem, updateJson, visitJson } from '@angular-devkit/schematics/tasks';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';
import { determineTargetProjectName } from '../utils';

interface Schema {
  project?: string;
}

const eslintConfig = apply(mergeWith(apply(templates.parse('../../files/eslintrc.json'), [
  move('.'),
])), [
  addESLintConfigForProject,
]);

const addESLintConfigForProject = (host: Tree, projectName: string) => {
  const packageJson = host.read('package.json');
  if (packageJson) {
    const sourceText = packageJson.toString();
    const jsonObject = JSON.parse(sourceText);
    jsonObject.devDependencies['@angular-eslint/builder'] = '^13.0.1';
    jsonObject.devDependencies['@angular-eslint/eslint-plugin'] = '^13.0.1';
    jsonObject.devDependencies['@angular-eslint/eslint-plugin-template'] = '^13.0.1';
    jsonObject.devDependencies['@angular-eslint/template-parser'] = '^13.0.1';
    jsonObject.devDependencies['eslint'] = '^7.28.0';
    jsonObject.devDependencies['eslint-plugin-import'] = '^2.22.1';
    jsonObject.devDependencies['eslint-plugin-jsdoc'] = '^30.7.6';
    jsonObject.devDependencies['eslint-plugin-node'] = '^11.
