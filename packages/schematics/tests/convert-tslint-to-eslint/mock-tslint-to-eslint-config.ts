import { ChildProcess, execSync } from 'child_process';
import { join } from 'path';
import { Tree, readJson, schematic } from '@angular-devkit/schematics';

interface ExampleTslintConfig {
  tslintPrintConfigResult: Record<string, unknown>;
}

const exampleRootTslintJson: ExampleTslintConfig = {
  tslintPrintConfigResult: {
    rules: {
      // example root tslint config
    },
  },
};

const exampleProjectTslintJson: ExampleTslintConfig = {
  tslintPrintConfigResult: {
    rulesDirectory: './node_modules/codelyzer',
    rules: {
      // example project tslint config
    },
  },
};

/**
 * The actual `findReportedConfiguration()` function is used to execute
 * `tslint --print-config` in a child process and read from the real
 * file system. This won't work for us in tests where we are dealing
 * with a Tree, so we mock out the responses from `findReportedConfiguration()`
 * with previously captured result data from that same command.
 */

export function mockFindReportedConfiguration(
  _: unknown,
  pathToTSLintJson: string,
): Record<string, unknown> {
  const examples = new Map<string, ExampleTslintConfig>([
    ['tslint.json', exampleRootTslintJson],
    ['projects/app1/tslint.json', exampleProjectTslintJson],
  ]);

  const example = examples.get(pathToTSLintJson);
  if (example) {
    return example.tslintPrintConfigResult;
  }

  throw new Error(
    `${pathToTSLintJson} is not a part of the supported mock data for these tests`,
  );
}

/**

