import {
  readExistingReadmeFile,
  ReadmeFileContent,
  regenerateReadmeRulesList,
} from '../utils/generate-rules-list';

/**
 * Determines whether or not the README needs updating
 * @returns {Promise<void>}
 */
async function checkReadmeRulesList(): Promise<void> {
  try {
    const existingReadme: ReadmeFileContent = await readExistingReadmeFile();

    if (existingReadme) {
      const updatedReadme: string | null = await regenerateReadmeRulesList();

      if (updatedReadme !== null && updatedReadme !== '') {
        if (existingReadme !== updatedReadme) {
          throw new Error(
            'Please update the README before pushing. You can run `yarn update-readme-rules-list`',
          );
        }
      }
    }
  } catch (err) {
    console.error(`\x1b[31m%s\x1b[0m`, err.message);
    process.exit(1);
  }
}

checkReadmeRulesList();


import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';

/**
 * Reads the existing READ
