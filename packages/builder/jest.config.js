// jest.config.js

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

const { NODE_ENV = 'test' } = process.env;

module.exports = {
  displayName: 'builder',
  preset: '../../jest.preset.js',
  rootDir: '.',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/builder',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: [
    '**/src/**/*.spec.[jt]s?(x)',
    '**/src/**/*.test.[jt]s?(x)',
  ],
  transformIgnorePatterns: [`<rootDir>/node_modules/`],
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  setupFiles: [require.resolve('./jest.setup.js')],
  testResultsProcessor: NODE_ENV === 'test' ? 'jest-junit' : undefined,
};
