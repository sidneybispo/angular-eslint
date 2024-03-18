import type { ChildProcess } from 'child_process';
import { spawn } from 'child_process';
import execa from 'execa';
import { join } from 'path';
import kill from 'tree-kill';
import type { ExecaChildProcess } from 'execa';

export const FIXTURES_DIR = join(__dirname, '../fixtures/');
export const LONG_TIMEOUT_MS = 600000; // 10 mins

let localRegistryProcess: ChildProcess | null = null;

const VERSION = `9999.0.1-local-integration-tests`;
const cwd = process.cwd();

const setupLocalRegistry = async (): Promise<void> => {
  try {
    process.env.npm_config_registry = `http://localhost:4872/`;
    process.env.YARN_REGISTRY = process.env.npm_config_registry;

    localRegistryProcess = spawn('npx', [
      'verdaccio',
      '--config',
      './local-registry/config.yml',
      '--listen',
      '4872',
    ]);

    return new Promise((resolve, reject) => {
      const collectedOutput: string[] = [];

      localRegistryProcess.stdout?.on('data', (data: Buffer) => {
        collectedOutput.push(data.toString());
        if (data.toString().includes('http address')) {
          resolve(undefined);
        }
      });

      localRegistryProcess.stderr?.on('data', (data: Buffer) => {
        collectedOutput.push(data.toString());
      });

      localRegistryProcess.on('error', (err: Error) => {
        console.error(collectedOutput.join(''));
        reject(err);
      });

      localRegistryProcess.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Failed to start the npm registry: exit code ${code}`);
          console.error(collectedOutput.join(''));
          reject(new Error(`Failed to start the npm registry`));
        }
      });
    });
  } catch (err) {
    console.error(`Failed to start the npm registry`, err);
    throw err;
  }
};

const cleanup = (code: number): void => {
  if (localRegistryProcess) localRegistryProcess.kill();

  try {
    kill(0);
    kill(0, 'SIGKILL');
    // eslint-disable-next-line no-empty
  } catch (err) {}

  process.chdir(cwd);
  process.exit(code);
};

const checkLocalRegistry = (): void => {
  if (process.env.npm_config_registry?.indexOf('http://localhost') === -1) {
    throw Error(`
      ------------------
      💣 ERROR 💣 => $NPM_REGISTRY does not look like a local registry'
      ------------------
    `);
  }
};

export { setupLocalRegistry, cleanup, checkLocalRegistry };

export const publishPackagesToVerdaccio = async (): Promise<ExecaChildProcess<string>> => {
  checkLocalRegistry();

  const subprocess = execa('./publish-to-verdaccio.sh', [VERSION]);
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);

  return await subprocess;
};

export const runNpmInstall = async (): Promise<ExecaChildProcess<string>> => {
  checkLocalRegistry();

  const subprocess = execa('npm', ['install']);
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);

  return await subprocess;
};

// ... Add other functions here, following the same pattern
