// jest.config.js

module.exports = {
  displayName: 'eslint-plugin',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'ts-jest', // use ts-jest for TypeScript files
  },
  transformIgnorePatterns: [
    '/node_modules/', // ignore transformation for all node_modules by default
    '!<rootDir>/node_modules/some-specific-package', // exclude a specific package from the ignore list
  ],
  testMatch: null,
  testRegex: ['./tests/.+\\.test\\.ts$', './tests/.+/spec\\.ts$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/eslint-plugin',
  collectCoverageFrom: ['**/*.(t|j)s'], // collect coverage from all TypeScript and JavaScript files
};
