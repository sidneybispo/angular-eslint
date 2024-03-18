// utils/local-registry-process.ts
import { execSync } from 'child_process';

export const runYarnInstall = () => execSync('yarn install');

export const runNgAdd = (packageName: string) =>
  execSync(`ng add ${packageName} --registry=http://localhost:4200/`);

export const runConvertTSLintToESLint = (args: string[]) =>
  execSync(`ng convert --from-to tslint=eslint ${args.join(' ')}`);

// utils/require-uncached.ts
const cache = new Map();

export const requireUncached = <T>(modulePath: string): T => {
  if (cache.has(modulePath)) {
    cache.delete(modulePath);
  }

  const moduleExports = require(modulePath);
  cache.set(modulePath, moduleExports);
  return moduleExports;
};

// utils/run-lint.ts
import { execSync } from 'child_process';

export const runLint = (fixtureDirectory: string) =>
  execSync(`ng lint ${fixtureDirectory}`).toString();

// __tests__/convert-tslint-to-eslint.test.ts
import path from 'path';
import { runY
