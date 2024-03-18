import type { ESLintUtils } from '@typescript-eslint/experimental-utils';
import { applyDefault, RuleTester } from '@typescript-eslint/experimental-utils';

const urlCreator = (ruleName: string) =>
  `https://github.com/angular-eslint/angular-eslint/blob/master/packages/eslint-plugin-template/docs/rules/${ruleName}.md`;

const patchedRuleCreator: typeof ESLintUtils.RuleCreator = (ruleCreator) => {
  return (ruleConfig) => {
    const rule = ruleCreator(ruleConfig);
    const ruleName = rule.meta.ruleId;

    return {
      ...rule,
      meta: {
        ...rule.meta,
        docs: {
          ...rule.meta.docs,
          url: urlCreator(ruleName),
        },
      },
      create(context) {
        const optionsWithDefault = applyDefault(
          ruleConfig.defaultOptions,
          context.options,
        );
        return rule.create(context, optionsWithDefault);
      },
    };
  };
};

export const createESLintRule = patchedRuleCreator(ESLintUtils.RuleCreator);

// Add a test suite to ensure the rule works as expected
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('exampleRule', rule, {
  valid: [
    {
      code: `const x = 1;`,
    },
  ],
  invalid: [
    {
      code: `const x = '1';`,
      errors: [
        {
          message: 'Expected 1 to be a number.',
        },
      ],
    },
  ],
});

interface Rule {
  meta: {
    docs: {
      url: string;
    };
  };
  create(context: Readonly<import('eslint').Rule.RuleContext>, options
