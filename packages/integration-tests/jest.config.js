'use strict';

module.exports = {
  /**
   * Specifies the environment in which the tests should run.
   * In this case, it is set to 'node' which means that the tests will be run in a Node.js environment.
   */
  testEnvironment: 'node',

  /**
   * Configures the transformations that should be applied to the code during the testing process.
   * In this case, it is set to use 'ts-jest' for transforming TypeScript files with the extensions '.ts' and '.tsx'.
   */
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  /**
   * Specifies the regular expression pattern that identifies which files contain tests.
   * In this case, it is set to match all files in the 'tests' directory that end with '.test.ts'.
   */
  testRegex: './tests/.+\\.test\\.ts$',

  /**
   * Determines whether or not coverage information should be collected during the testing process.
   * In this case, it is set to false, which means that coverage information will not be collected.
   */
  collectCoverage: false,

  /**
   * Specifies the file extensions that should be considered when resolving modules during the testing process.
   * In this case, it is set to consider files with the extensions '.ts', '.tsx', '.js', '.jsx', '.json', and '.node'.
   */
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  /**
   * Specifies the reporters that should be used to generate coverage reports during the testing process.
   * In this case, it is set to generate both a 'text-summary' report and an 'lcov' report.
   */
  coverageReporters: ['text-summary', 'lcov'],
};
