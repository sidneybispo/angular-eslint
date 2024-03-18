import { updateReadmeFile, regenerateReadmeRulesList } from '../utils/generate-rules-list';

const updateReadmeRulesListAsync = async () => {
  try {
    const updatedReadme = await regenerateReadmeRulesList();
    await updateReadmeFile(updatedReadme);
    console.log('README.md file updated successfully');
  } catch (err) {
    console.error('Error updating README.md file:', err);
    process.exit(1);
  }
};

updateReadmeRulesListAsync();
