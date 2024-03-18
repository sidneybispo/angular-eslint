// Force module scoping
export default {};

jest.mock('eslint', () => ({
  ESLint: jest.fn(),
}));

const { ESLint } = require('eslint');

const mockedESLint = <jest.SpyInstance>ESLint;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lint } = require('./eslint-utils');

describe('eslint-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create the ESLint instance with the proper parameters (with config file)', async () => {
    await lint('/root', './.eslintrc.json', {
      fix: true,
      cache: true,
      cacheLocation: '/root/cache',
      cacheStrategy: 'content',
    });

    expect(mockedESLint).toHaveBeenCalledWith({
      overrideConfigFile: './.eslintrc.json',
      fix: true,
      cache: true,
      cacheLocation: '/root/cache',
      cacheStrategy: 'content',
      ignorePath: undefined,
      useEslintrc: true,
      errorOnUnmatchedPattern: false,
      rulePaths: [],
    });
  });

  it('should create the ESLint instance with the proper parameters (without config file)', async () => {
    await lint('/root', undefined, {
      fix: true,
      cache: true,
      cacheLocation: '/root/cache',
      cacheStrategy: 'content',
    });

    expect(mockedESLint).toHaveBeenCalledWith({
      overrideConfigFile: undefined,
      fix: true,
      cache: true,
      cacheLocation: '/root/cache',
      cacheStrategy: 'content',
      ignorePath: undefined,
      useEslintrc: true,
      errorOnUnmatchedPattern: false,
      rulePaths: [],
    });
  });

  describe('noEslintrc', () => {
    it('should create the ESLint instance with "useEslintrc" set to false', async () => {
      await lint('/root', undefined, {
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        noEslintrc: true,
      });

      expect(mockedESLint).toHaveBeenCalledWith({
        overrideConfigFile: undefined,
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        ignorePath: undefined,
        useEslintrc: false,
        errorOnUnmatchedPattern: false,
        rulePaths: [],
      });
    });
  });

  describe('rulesdir', () => {
    it('should create the ESLint instance with "rulePaths" set to the given value for rulesdir', async () => {
      const extraRuleDirectories = ['./some-rules', '../some-more-rules'];

      await lint('/root', undefined, {
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        cacheStrategy: 'content',
        rulesdir: extraRuleDirectories,
      });

      expect(mockedESLint).toHaveBeenCalledWith({
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        cacheStrategy: 'content',
        ignorePath: undefined,
        useEslintrc: true,
        errorOnUnmatchedPattern: false,
        rulePaths: extraRuleDirectories,
      });
    });
  });

  describe('resolvePluginsRelativeTo', () => {
    it('should create the ESLint instance with "resolvePluginsRelativeTo" set to the given value for resolvePluginsRelativeTo', async () => {
      await lint('/root', undefined, {
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        cacheStrategy: 'content',
        resolvePluginsRelativeTo: './some-path',
      });

      expect(mockedESLint).toHaveBeenCalledWith({
        fix: true,
        cache: true,
        cacheLocation: '/root/cache',
        cacheStrategy: 'content',
        ignorePath: undefined,
        useEslintrc: true,
        errorOnUnmatchedPattern: false,
        rulePaths: [],
        resolvePluginsRelativeTo: './some-path',
      });
    });
  });
});
