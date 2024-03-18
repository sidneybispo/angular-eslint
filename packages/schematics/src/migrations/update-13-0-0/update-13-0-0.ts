import { Rule, SchematicsException } from '@angular-devkit/schematics';
import { chain } from '@angular-devkit/schematics';
import { updateDependencies } from '../utils/dependencies';

const requiredVersions = {
  '@typescript-eslint/eslint-plugin': '5.3.0',
  '@typescript-eslint/experimental-utils': '5.3.0',
  '@typescript-eslint/parser': '5.3.0',
  eslint: '^8.2.0',
  'eslint-plugin-import': '2.25.2',
};

export default function migration(): Rule {
  return chain(() => {
    try {
      return updateDependencies(requiredVersions);
    } catch (error) {
      throw new SchematicsException(error.message);
    }
  });
}
