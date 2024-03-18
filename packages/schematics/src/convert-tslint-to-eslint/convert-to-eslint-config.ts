import { normalize } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { execSync } from 'child_process';
import {
  Linter as ESLintLinter,
  RuleTester,
  ConfigData,
  ESLint,
} from 'eslint';
import { dirSync } from 'tmp';
import * as TslintToEslintConfig from 'tslint-to-eslint-config';
import { readJsonInTree, visitNotIgnoredFiles } from '../utils';

const tslintToEslintConfigVersion =
  require('../../package.json').devDependencies['tslint-to-eslint-config'];

type TslintToEslintConfigLibrary = {
  createESLintConfiguration: typeof TslintToEslintConfig['createESLintConfiguration'];
  findReportedConfiguration: typeof TslintToEslintConfig['findReportedConfiguration'];
  joinConfigConversionResults: typeof TslintToEslintConfig['joinConfigConversionResults'];
  convertFileComments: typeof TslintToEslintConfig['convertFileComments'];
};

let tslintToEslintConfigLibrary: TslintToEslintConfigLibrary;

async function getTslintToEslintConfigLibrary(
  context: SchematicContext,
): Promise<TslintToEslintConfigLibrary> {
  if (tslintToEslintConfigLibrary) {
    return tslintToEslintConfigLibrary;
  }

  try {
    // This is usually not available at runtime but makes it easier to work with in our tests
    return require('tslint-to-eslint-config');
    // eslint-disable-next-line no-empty
  } catch (e) {}

  context.logger.info(
    '\nINFO: We are now installing the "tslint-to-eslint-config" package into a tmp directory to aid with the conversion',
  );
  context.logger.info('\nThis may take a minute or two...\n');

  /**
   * In order to avoid all users of angular-eslint needing to have tslint-to-eslint-config (and therefore tslint)
   * in their node_modules, we dynamically install and uninstall the library as part of the conversion
   * process.
   */
  const tempDir = dirSync().name;
  execSync(`npm i -D tslint-to-eslint-config@${tslintToEslintConfigVersion}`, {
    cwd: tempDir,
    stdio: 'ignore',
  });

  tslintToEslintConfigLibrary = require(require.resolve(
    'tslint-to-eslint-config',
    {
      paths: [tempDir],
    },
  ));
  return tslintToEslintConfigLibrary;
}

export function createConvertToESLintConfig(context: SchematicContext) {
  return async function convertToESLintConfig(
    pathToTslintJson: string,
    tslintJson: Record<string, unknown>,
  ): Promise<{
    convertedESLintConfig: ESLintLinter.Config;
    unconvertedTSLintRules: TslintToEslintConfig.TSLintRuleOptions[];
    ensureESLintPlugins: string[];
  }> {
    const {
      findReportedConfiguration,
      createESLintConfiguration,
      joinConfigConversionResults,
    } = await getTslintToEslintConfigLibrary(context);

    const reportedConfiguration = await findReportedConfiguration(
      'npx tslint --print-config',
      pathToTslintJson,
    );

    if (reportedConfiguration instanceof Error) {
      if (
        reportedConfiguration.message.includes('unknown option `--print-config')
      ) {
        throw new Error(
          '\nError: TSLint v5.18 required in order to run this schematic. Please update your version and try again.\n',
        );
      }
      /**
       * Make a print-config issue easier to understand for the end user.
       * This error could occur if, for example, the user does not have a TSLint plugin installed correctly that they
       * reference in their config.
       */
      const printConfigFailureMessageStart =
        'Command failed: npx tslint --print-config "tslint.json"';
      if (
        reportedConfiguration.message.startsWith(printConfigFailureMessageStart)
      ) {
        throw new Error(
          `\nThere was a critical error when trying to inspect your tslint.json: \n${reportedConfiguration.message.replace(
            printConfigFailureMessageStart,
            '',
          )}`,
        );
      }

      throw new Error(`Unexpected error: ${reportedConfiguration.message}`);
    }

    const originalConfigurations = {
      tslint: {
        full: reportedConfiguration,
        raw: tslintJson,
      },
    };

    const summarizedConfiguration = await createESLintConfiguration(
      originalConfigurations,
    );

    const expectedESLintPlugins = [
      // These are added to support the ng-cli-compat configs
      'eslint-plugin-jsdoc',
      'eslint-plugin-prefer-arrow',
      'eslint-plugin-import',
      // These are already covered by our recommended config, and are installed by the `ng add` schematic
      '@angular-eslint/eslint-plugin',
      '@angular-eslint/eslint-plugin-template',
    ];

    const convertedESLintConfig = joinConfigConversionResults(
      summarizedConfiguration,
      originalConfigurations,
    ) as ESL
