import execa from 'execa';
import path from 'path';
import stripAnsi from 'strip-ansi';

const FIXTURES_DIR = path.join(__dirname, '../fixtures/');

type NormalizeOutputFn = (value: string) => string;

const normalizeOutput: NormalizeOutputFn = (value) => {
  const ansiRemoved = stripAnsi(value);
  return ansiRemoved.replace(
    new RegExp(`^${FIXTURES_DIR.replace(/\\/g, '\\\\')}(.*?)$`, 'gm'),
    (_, c1) => `__ROOT__/${c1.replace(/\\/g, '/')}`,
  );
};

type RunLintFn = (directory: string) => Promise<string | undefined>;

const runLint: RunLintFn = async (directory) => {
  try {
    const command = 'npx';
    const args = ['ng', 'lint'];
    const cwd = path.join(FIXTURES_DIR, directory);

    const subprocess = execa(command, args, { cwd });

    subprocess.stdout?.pipe(process.stdout);
    subprocess.stderr?.pipe(process.stderr);

    const { stdout } = await subprocess;

    return normalizeOutput(stdout);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Command '${error.command}' not found.`);
    } else {
      console.error(error);
    }
  }
};

export default runLint;
