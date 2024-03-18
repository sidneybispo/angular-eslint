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
import {
  ProjectType,
  TestProject,
  testProjects,
} from '../utils/test-projects';

const fixtureDirectory = 'v1123-strict-multi-project-auto-convert';

type ProjectEslintConfig = {
  rootProject: ReturnType<typeof requireUncached>;
  additionalProjects: Record<ProjectType, ReturnType<typeof requireUncached>>;
};

const getProjectEslintConfig = async (): Promise<ProjectEslintConfig> => {
  const rootProject = requireUncached(
    join(FIXTURES_DIR, fixtureDirectory, '.eslintrc.json'),
  );

  const additionalProjects: Record<ProjectType, any> = {};
  for (const project of testProjects) {
    additionalProjects[project.type] = requireUncached(
      join(
        FIXTURES_DIR,
        fixtureDirectory,
        `projects/${project.name}/.eslintrc.json`,
      ),
    );
  }

  return { rootProject, additionalProjects };
};

const getProjectLintConfig = async (): Promise<Record<ProjectType, any>> => {
  const lintConfigs: Record<ProjectType, any> = {};
  for (const project of testProjects) {
    lintConfigs[project.type] = requireUncached(
      join(
        FIXTURES_DIR,
        fixtureDirectory,
        `angular.json`
      )
    ).projects[project.name].architect.lint;
  }

  return lintConfigs;
};

describe(fixtureDirectory, () => {
  jest.setTimeout(LONG_TIMEOUT_MS);

  beforeEach(async () => {
    process.chdir(path.join(FIXTURES_DIR, fixtureDirectory));
    await runYarnInstall();
    await runNgAdd();

    // Convert the root project first
    await runConvertTSLintToESLint(['--no-interactive', '--project', fixtureDirectory]);
    for (const project of testProjects) {
      await runConvertTSLintToESLint([
        '--no-interactive',
        '--project',
        join(fixtureDirectory, `projects/${project.name}`),
      ]);
    }
  });

  it.each(testProjects)('it should pass linting after converting the out of the box Angular CLI setup for project %p', async (project: TestProject) => {
    const { rootProject, additionalProjects } = await getProjectEslintConfig();
    const lintConfigs = await getProjectLintConfig();

    expect(rootProject).toMatchSnapshot();
    expect(lintConfigs[project.type]).toMatchSnapshot();
    expect(additionalProjects[project.type]).toMatchSnapshot();

    const lintOutput: LintOutput = await runLint(fixtureDirectory);
    expect(lintOutput.errorCount).toBe(0);
    expect(lintOutput.warningCount).toBeGreaterThanOrEqual(0);
    expect(lintOutput.output).toMatchSnapshot();
  });
});
