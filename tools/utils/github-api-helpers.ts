import type { RequestOptions } from 'https';
import type { CodelyzerRule, PRDetails } from './interfaces';
import fetch from 'node-fetch';

/**
 * Calls the github api for the specified path and returns a Promise for the json response.
 */
const callGithubApi = async <T>(optionOverrides: RequestOptions): Promise<T> => {
  const options = {
    protocol: 'https:',
    host: 'api.github.com',
    headers: {
      'User-Agent': 'angular-eslint',
    },
    ...optionOverrides,
  };

  try {
    const response = await fetch(options);
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error
    console.error(error);
    throw error;
  }
};

/**
 * Returns a list of rule names that are currently in progress.
 */
export const getAngularESLintPRs = async (): Promise<PRDetails[]> => {
  const prsJson = await callGithubApi<PRDetails[]>({
    path: '/repos/angular-eslint/angular-eslint/pulls?state=open',
  });

  return prsJson.map<PRDetails>(({ title, state, url, number }) => ({
    title,
    state,
    url,
    number,
  }));
};

/**
 * Returns a list of `CodelyzerRule`s from the Codelyzer repository.
 */
export const getCodelyzerRulesList = async (): Promise<CodelyzerRule[]> => {
  const rulesJson = await callGithubApi<CodelyzerRule[]>({
    host: 'raw.githubusercontent.com',
    path: '/mgechev/codelyzer/master/docs/_data
