/* eslint-disable @typescript-eslint/no-var-requires */
import path, { dirname, join } from 'path';
import {
  FIXTURES_DIR,
  LONG_TIMEOUT_MS,
  runConvertTSLintToESLint,
  runNgAdd,
  runYarnInstall,
} from '../utils/local-registry-process';
import { requireUncached } from '../utils/require-uncached';
import { runLint, LintOutput } from '../utils/run-lint';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

type Project = {
  dir: string;
  projectName: string;
};

const fixtureDirectory = 'v1123-multi-project-yarn-auto-convert';

const projects: Project[] = [
  { dir: fixtureDirectory, projectName: fixtureDirectory },
  { dir: join(fixtureDirectory, 'projects', 'another-app'), projectName: 'another-app' },
  { dir: join(fixtureDirectory, 'projects', 'another-lib'), projectName: 'another-lib' },
];

describe(fixtureDirectory, () => {
  jest.setTimeout(LONG_TIMEOUT_MS);

  beforeEach(async () => {
    process.chdir(path.join(FIXTURES_DIR, fixtureDirectory));
    await runYarnInstall();
    await runNgAdd();

    for (const project of projects) {
      try {
        await runConvertTSLintToESLint([
          '--no-interactive',
          '--project',
          project.projectName,
        ]);
      } catch (e) {
        console.error(`Failed to convert tslint to eslint for project ${project.projectName}`);
        console.error(e);
      }
    }
  });

  afterEach(() => {
    for (const project of projects) {
      try {
        execSync(`rm -f ${join(project.dir, '.eslintrc.js')}`);
      } catch (e) {
        console.error(`Failed to remove .eslintrc.js file for project ${project.projectName}`);
        console.error(e);
      }
    }
  });

  describe.each(projects)('project: %s', (_, project) => {
    it('should pass linting after converting the out of the box Angular CLI setup', async () => {
      expect.assertions(3);

      const eslintrcJson = readFileSync(join(project.dir, '.eslintrc.json'), 'utf-8');
      expect(requireUncached(eslintrcJson)).toMatchSnapshot();

      const angularJson = readFileSync(join(fixtureDirectory, 'angular.json'), 'utf-8');
      expect(JSON.parse(angularJson).projects[project.projectName].architect.lint).toMatchSnapshot();

      const lintOutput: LintOutput = await runLint(project.dir);
      expect(lintOutput).toMatchSnapshot();
    });
  });
});
