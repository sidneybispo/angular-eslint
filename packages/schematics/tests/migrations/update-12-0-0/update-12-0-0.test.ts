import { Tree, SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import * as fs from 'fs';
import { jest } from '@jest/globals';

const migrationSchematicRunner = new SchematicTestRunner(
  '@angular-eslint/schematics',
  path.join(__dirname, '../../../src/migrations.json'),
);

jest.mock('fs');

describe('update-12-0-0', () => {
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@angular-eslint/builder': '4.3.0',
          '@angular-eslint/eslint-plugin': '4.3.0',
          '@angular-eslint/eslint-plugin-template': '4.3.0',
          '@angular-eslint/template-parser': '4.3.0',
          '@typescript-eslint/eslint-plugin': '4.16.1',
          '@typescript-eslint/experimental-utils': '4.16.1',
          '@typescript-eslint/parser': '4.16.1',
          eslint: '^7.6.0',
        },
      }),
    );
    appTree.create(
      'angular.json',
      JSON.stringify({
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        newProjectRoot: 'projects',
        projects: {
          foo: {
            root: 'projects/foo',
          },
          bar: {
            root: 'projects/bar',
          },
        },
      }),
    );

    // Root config
    appTree.create(
      '.eslintrc.json',
      JSON.stringify({
        rules: {
          '@angular-eslint/template/accessibility-label-for': 'error',
          '@angular-eslint/template/accessibility-label-has-associated-control':
            'error',
        },
        // Overrides extends
        overrides: [
          // String form of extends
          {
            files: ['*.ts'],
            extends: 'plugin:@angular-eslint/recommended',
            rules: {
              '@angular-eslint/template/accessibility-label-for': ['error'],
              '@angular-eslint/template/no-negated-async': 'error',
            },
          },
        ],
      }),
    );

    // Project configs
    appTree.write(
      'projects/foo/.eslintrc.json',
      JSON.stringify({ extends: ['plugin:@angular-eslint/recommended'] }),
    );
    appTree.write(
      'projects/bar/.eslintrc.json',
      JSON.stringify({
        // Overrides extends
        overrides: [
          // Array form of extends
          {
            files: ['*.ts'],
            extends: [
              'plugin:@angular-eslint/something-other-than-recommended',
            ],
            rules: {
              '@angular-eslint/template/accessibility-label-for': [
                'error',
                {
                  controlComponents: ['p-inputMask', 'bs4-input'],
                  labelAttributes: ['assoc', 'elementId'],
                  labelComponents: ['app-label', 'ngx-label'],
                },
              ],
              '@angular-eslint/template/no-negated-async': 'error',
            },
          },
        ],
      }),
    );
  });

  it('should update relevant @angular-eslint, @typescript-eslint and eslint dependencies', async () => {
    const tree = await migrationSchematicRunner
      .runSchematicAsync('update-12-0-0', {}, appTree)
      .toPromise();
    const packageJSON = JSON.parse(tree.readContent('/package.json'));
    expect(packageJSON).toMatchInlineSnapshot(`
      Object {
        "devDependencies": Object {
          "@angular-eslint/builder": "^12.0.0",
          "@angular-eslint/eslint-plugin": "^12.0.0",
          "@angular-eslint/eslint-plugin-template": "^12.0.0",
          "@angular-eslint/template-parser": "^12.0.0",
          "@typescript-eslint/eslint-plugin": "4.28.2",
          "@typescript-eslint/experimental-utils": "4.28.2",
          "@typescript-eslint/parser": "4.28.2",
          "eslint": "^7.26.0",
        },
      }
    `);
  });

  it('should migrate from accessibility-label-for to accessibility-label-has-associated-control', async () => {
    const tree = await migrationSchematicRunner
      .runSchematicAsync('update-12-0-0', {}, appTree)
      .toPromise();
    const rootESLint = JSON.parse(tree.readContent('.eslintrc.json'));
    expect(rootESLint).toMatchInlineSnapshot(`
      Object {
        "overrides
