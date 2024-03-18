import path from 'path';
import {
  FIXTURES_DIR,
  LONG_TIMEOUT_MS,
  runNgAdd,
  runNpmInstall,
} from '../utils/local-registry-process';
import { runLint } from '../utils/run-lint';

describe('v1123-multi-project-manual-config', () => {
  const fixtureDirectory = 'v1123-multi-project-manual-config';
  const lintOutputSnapshotPath = path.join(fixtureDirectory, 'lint-output.snapshot');

  jest.setTimeout(LONG_TIMEOUT_MS);

  beforeEach(async () => {
    const cwd = process.cwd();
    process.chdir(path.join(FIXTURES_DIR, fixtureDirectory));
    await runNpmInstall();
    await runNgAdd();
    process.chdir(cwd);
  });

  it('should produce the expected lint output', async () => {
    const lintOutput = await runLint(fixtureDirectory);
    expect(lintOutput).toMatchFileSnapshot(lintOutputSnapshotPath);
  });

  // Add this afterTest hook to update the snapshot file when the test fails
  afterTest(async (test, result) => {
    if (result.status === 'failed') {
      const lintOutput = await runLint(fixtureDirectory);
      writeFileSync(lintOutputSnapshotPath, lintOutput);
    }
  });
});
