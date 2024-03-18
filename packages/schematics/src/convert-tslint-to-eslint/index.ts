import {
  addESLintTargetToProject,
  createESLintConfigForProject,
  determineTargetProjectName,
  getProjectConfig,
  getWorkspacePath,
  isTSLintUsedInWorkspace,
  offsetFromRoot,
  readJsonInTree,
  removeTSLintJSONForProject,
  setESLintProjectBasedOnProjectType,
  updateJsonInTree,
} from '../utils';
import {
  convertTSLintDisableCommentsForProject,
  createConvertToESLintConfig,
} from './convert-to-eslint-config';
import { Schema as ConvertSchema } from './schema';
import {
  ensureESLintPluginsAreInstalled,
  uninstallTSLintAndCodelyzer,
  updateArrPropAndRemoveDuplication,
  updateObjPropAndRemoveDuplication,
} from './utils';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Linter } from 'eslint';
import { TSLintRuleOptions } from 'tslint-to-eslint-config';

const eslintPlugin = require('@angular-eslint/eslint-plugin');
const eslintPluginTemplate = require('@angular-eslint/eslint-plugin-template');

const eslintPluginConfigBaseOriginal = eslintPlugin.configs.base;
const eslintPluginConfigNgCliCompatOriginal =
  eslintPlugin.configs['ng-cli-compat'];
const eslintPluginConfigNgCliCompatFormattingAddOnOriginal =
  eslintPlugin.configs['ng-cli-compat--formatting-add-on'];
const eslintPluginTemplateConfigRecommendedOriginal =
  eslintPluginTemplate.configs.recommended;

export default function convert(userOptions: ConvertSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const projectName = determineTargetProjectName(tree, userOptions.project);
    if (!projectName) {
      context.logger.error(
        `Error: You must specify a project to convert because you have multiple projects in your angular.json\n` +
          `E.g. npx ng g @angular-eslint/schematics:convert-tslint-to-eslint {{YOUR_PROJECT_NAME_GOES_HERE}}\n`,
      );
      return;
    }

    const { root: projectRoot, projectType } = getProjectConfig(
      tree,
      projectName,
    );

    const rootESLintrcJsonPath = join(
      normalize(tree.root.path),
      '.eslintrc.json',
    );
    const projectTSLintJsonPath = join(normalize(projectRoot), 'tslint.json');

    try {
      const hasRootESLintrcConfig = tree.exists(rootESLintrcJsonPath);
      if (!hasRootESLintrcConfig) {
        context.logger.log('Creating root ESLint config...');
        createESLintConfigForProject(projectName)(tree, context);
      }
    } catch (error) {
      context.logger.error('Error creating root ESLint config: ' + error.message);
      return;
    }

    try {
      if (tree.exists(projectTSLintJsonPath)) {
        context.logger.log('Converting TSLint config to ESLint...');
        convertTSLintDisableCommentsForProject(projectName)(tree, context);
        removeExtendsFromProjectTSLintConfigBeforeConverting(tree, projectTSLintJsonPath);
        convertNonRootTSLintConfig(
          userOptions,
          projectRoot,
          projectType,
          projectTSLintJsonPath,
          rootESLintrcJsonPath,
        )(tree, context);
      } else {
        context.logger.log('No TSLint config found, skipping conversion...');
      }
    } catch (error) {
      context.logger.error('Error converting TSLint config: ' + error.message);
      return;
    }

    try {
      context.logger.log('Cleaning up...');
      cleanUpTSLintIfNoLongerInUse(tree, userOptions, context);
    } catch (error) {
      context.logger.error('Error cleaning up: ' + error.message);
      return;
    }
  };
}

// ... rest of the code
