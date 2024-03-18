import type { TSESLint } from '@typescript-eslint/experimental-utils';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { format, resolveConfig } from 'prettier';
import eslintPlugin from '../../packages/eslint-plugin/src';
import eslintPluginTemplate from '../../packages/eslint-plugin-template/src';

const prettierConfig = resolveConfig.sync(__dirname);

type RuleEntry = [string, TSESLint.RuleModule<string, unknown[]>];
type LinterConfigRules = Record<string, TSESLint.Linter.RuleLevel | undefined>;
type LinterConfig = TSESLint.Linter.Config & {
  extends?: string | string[];
  plugins?: string[];
};

const getPluginRules = (plugin: any) =>
  Object.entries(plugin.rules).sort((a, b) => a[0].localeCompare(b[0]));

const writeConfigFile = (config: LinterConfig, filePath: string) => {
  const configStr = format(JSON.stringify(config), {
    parser: 'json',
    ...prettierConfig,
  });

  if (fs.existsSync(filePath)) {
    console.warn(`Config file already exists: ${filePath}`);
  } else {
    fs.writeFileSync(filePath, configStr);
    console.log(`Config file created: ${filePath}`);
  }
};

const MAX_RULE_NAME_LENGTH = Math.max(
  ...getPluginRules(eslintPlugin).map(([name]) => name.length),
  ...getPluginRules(eslintPluginTemplate).map(([name]) => name.length),
);

const DEFAULT_RULE_SETTING = 'warn';

const reducer = (
  ruleNamePrefix: '@angular-eslint/' | '@angular-eslint/template/',
  config: LinterConfigRules,
  [key, value]: RuleEntry,
  {
    errorLevel,
    filterDeprecated,
    filterRequiresTypeChecking,
  }: {
    errorLevel?: 'error' | 'warn';
    filterDeprecated: boolean;
    filterRequiresTypeChecking?: 'include' | 'exclude';
  },
) => {
  if (filterDeprecated && value.meta?.deprecated) {
    return config;
  }

  if (
    filterRequiresTypeChecking === 'exclude' &&
    value.meta?.docs?.requiresTypeChecking === true
  ) {
    return config;
  }

  if (
    filterRequiresTypeChecking === 'include' &&
    value.meta?.docs?.requiresTypeChecking !== true
  ) {
    return config;
  }

  const ruleName = `${ruleNamePrefix}${key}`;
  const recommendation = value.meta?.docs?.recommended;
  const usedSetting = errorLevel ?? (recommendation ? 'warn' : DEFAULT_RULE_SETTING);

  console.log(
    `${chalk.dim(ruleNamePrefix)}${key.padEnd(MAX_RULE_NAME_LENGTH)}`,
    '=',
    usedSetting === 'error' ? chalk.red(usedSetting) : chalk.yellow(usedSetting),
  );

  config[ruleName] = usedSetting;
  return config;
};

const baseConfig: LinterConfig = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', '@angular-eslint'],
};

writeConfigFile(baseConfig, path.resolve(__dirname, '../../packages/eslint-plugin/src/configs/base.json'));

const allConfig: LinterConfig = {
  extends: './configs/base.json',
  rules: {
    ...getPluginRules(eslintPlugin).reduce<LinterConfigRules>(
      (config, [key, value]) => reducer('@angular-eslint/', config, [key, value], { errorLevel: 'error', filterDeprecated: true }),
      {},
    ),
  },
};

writeConfigFile(allConfig, path.resolve(__dirname, '../../packages/eslint-plugin/src/configs/all.json'));

const recommendedConfig: LinterConfig = {
  extends: './configs/base.json',
  rules: {
    ...getPluginRules(eslintPlugin)
      .filter(([key]) => !!eslintPlugin.rules[key].meta?.docs?.recommended)
      .reduce<LinterConfigRules>(
        (config, [key, value]) => reducer('@angular-eslint/', config, [key, value], { filterDeprecated: false, filterRequiresTypeChecking: 'exclude' }),
        {},
      ),
  },
};

writeConfigFile(
  recommendedConfig,
  path.resolve(
    __dirname,
    '../../packages/eslint-plugin/src/configs/recommended.json',
  ),
);

const recommendedExtraConfig: LinterConfig = {
  extends: './configs/base.json',
  rules: {
    // ORIGINAL tslint.json -> "import-blacklist": [true, "rxjs/Rx"],
    'no-restricted-imports': [
     
