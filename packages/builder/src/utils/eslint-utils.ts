import * as ESLintLibrary from 'eslint';
import { join } from 'path';
import { readFileSync } from 'fs';

export async function loadESLint(): Promise<typeof ESLintLibrary> {
  let eslint;
  try {
    // Use dynamic import here to avoid importing ESLint unnecessarily
    eslint = await import('eslint');
    return eslint;
  } catch (error) {
    throw new Error('Unable to find ESLint. Ensure ESLint is installed: ' + error.message);
  }
}

export async function lint(
  workspaceRoot: string,
  eslintConfigPath: string | undefined,
  options: ESLintLibrary.ESLint.Options & { lintFilePatterns: string[] },
): Promise<ESLintLibrary.ESLint.LintResult[]> {
  const projectESLint = await loadESLint();

  const eslintConfig = eslintConfigPath
    ? JSON.parse(readFileSync(eslintConfigPath, 'utf-8'))
    : undefined;

  const eslint = new projectESLint.ESLint({
    ...(eslintConfig && { overrideConfigFile: eslintConfig }),
    ignorePath: options.ignorePath,
    fix: options.fix,
    cache: options.cache,
    cacheLocation: options.cacheLocation,
    cacheStrategy: options.cacheStrategy,
    resolvePluginsRelativeTo: options.resolvePluginsRelativeTo,
    rulePaths: options.rulePaths,
    errorOnUnmatchedPattern: false,
  });

  return await eslint.lintFiles(
    options.lintFilePatterns.map((p) => join(workspaceRoot, p)),
  );
}
