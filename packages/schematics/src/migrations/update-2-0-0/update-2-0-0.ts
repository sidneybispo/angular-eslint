import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { chain, mergeWith, apply, url, move } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import type { Linter } from 'eslint';
import { updateJsonInTree, visitNotIgnoredFiles } from '../../utils';

const updatedAngularESLintVersion = '^2.0.0';
const updatedTypeScriptESLintVersion = '4.16.1';
const eslintConfigsPath = 'eslintrc.json';
const packageJsonPath = 'package.json';

function updateIfExists(
  deps: Record<string, string> | undefined,
  depName: string,

