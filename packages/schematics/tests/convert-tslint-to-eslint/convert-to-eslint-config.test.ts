import {
  createConvertToESLintConfig,
  ConvertToESLintConfigResult,
} from '../../src/convert-tslint-to-eslint/convert-to-eslint-config';
import * as tslintToEslintConfig from 'tslint-to-eslint-config';
import * as exampleTslintJson from './example-tslint-configs';

// Mock the findReportedConfiguration function from tslint-to-eslint-config
const mockFindReportedConfiguration = jest.fn();

// Mock the tslint-to-eslint-config module
jest.mock('tslint-to-eslint-config', () => {
  return {
    ...jest.requireActual('tslint-to-eslint-config'),
    findReportedConfiguration: mockFindReportedConfiguration,
  };
});

describe('convertToESLintConfig()', () => {
  let convertToESLintConfig: (
    tslintFilePath: string,
    tslintFileContent: string,
  ) => Promise<ConvertToESLintConfigResult>;

  beforeEach(async () => {
    // Reset the mocks
    jest.clearAllMocks();

    // Create the convertToESLintConfig function
    convertToESLintConfig = createConvertToESLintConfig({
      logger: { info: () => {} },
    });
  });

  it.each([
    [
      'should work for a root tslint.json file',
      exampleTslintJson.exampleRootTslintJson.raw,
      exampleTslintJson.exampleRootTslintJson.eslintConfig,
    ],
    [
      'should work for a project tslint.json file',
      exampleTslintJson.exampleProjectTslintJson.raw,
      exampleTslintJson.exampleProjectTslintJson.eslintConfig,
    ],
  ])('%s', async (_, tslintFileContent, expectedEslintConfig) => {
    // Mock the findReportedConfiguration function to return the tslintFileContent
    mockFindReportedConfiguration.mockReturnValue(tslintFileContent);

    // Call the convertToESLintConfig function
    const result: ConvertToESLintConfigResult = await convertToESLintConfig(
      'tslint.json',
      tslintFileContent,
    );

    // Check the convertedESLintConfig
    expect(result.convertedESLintConfig).toStrictEqual(expectedEslintConfig);

    // Check the ensureESLintPlugins
    expect(result.ensureESLintPlugins).toStrictEqual([]);

    // Check the unconvertedTSLintRules
    expect(result.unconvertedTSLintRules).toStrictEqual([]);
  });
});
