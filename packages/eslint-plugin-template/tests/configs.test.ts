import { configs, rules } from '../src';
import 'jest';

jest.mock('../src');

const ESLINT_PLUGIN_TEMPLATE_PREFIX = '@angular-eslint/template/';

type Config = {
  extends?: string | string[];
  rules?: { [ruleName: string]: string | Record<string, unknown> };
  overrides?: Config[];
};

function containsRule(config: Config, ruleName: string): boolean {
  const prefixedRuleName = `${ESLINT_PLUGIN_TEMPLATE_PREFIX}${ruleName}`;
  return Boolean(
    config.rules?.[prefixedRuleName] ||
      config.overrides?.some(({ rules }) => rules?.[prefixedRuleName]),
  );
}

describe('configs', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe.each`
  config       | name
  ${configs.all} | ${'all'}
  ${configs.recommended} | ${'recommended'}
`('$name', ({ config }) => {
    it('should contain all of the rules from the plugin', () => {
      expect(
        Object.keys(rules).every((ruleName) =>
          containsRule(config, ruleName),
        ),
      ).toBe(true);
    });

    it('should only contain valid rules', () => {
      expect(
        Object.keys(config.rules)
          .filter((ruleName) =>
            ruleName.startsWith(ESLINT_PLUGIN_TEMPLATE_PREFIX),
          )
          .every((ruleName) =>
            Boolean(
              rules[
                ruleName.slice(
                  ESLINT_PLUGIN_TEMPLATE_PREFIX.length,
                ) as keyof typeof rules
              ],
            ),
          ),
      ).toBe(true);
    });
  });

  describe('base', () => {
    it('exists', () => {
      expect(configs.base).toBeDefined();
    });
  });

  describe('containsRule', () => {
    it.each`
      config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
