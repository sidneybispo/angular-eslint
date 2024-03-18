import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Tree, readContent } from '@angular-devkit/schematics';

const migrationSchematicRunner = new SchematicTestRunner(
  '@angular-eslint/schematics',
  path.join(__dirname, '../../../src/migrations.json'),
);

describe('update-4-0-0 migration', () => {
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = new UnitTestTree(Tree.empty());

    const packageJsonContent = `{
      "devDependencies": {
        "@angular-eslint/builder": "3.0.1",
        "@angular-eslint/eslint-plugin": "3.0.1",
        "@angular-eslint/eslint-plugin-template": "3.0.1",
        "@angular-eslint/template-parser": "3.0.1"
      }
    }`;

    appTree.create('package.json', packageJsonContent);

    const angularJsonContent = `{
      "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
      "version": 1,
      "newProjectRoot": "projects",
      "projects": {
        "foo": {
          "root": "projects/foo"
        },
        "bar": {
          "root": "projects/bar"
        }
      }
    }`;

    appTree.create('angular.json', angularJsonContent);
  });

  it('should update relevant @angular-eslint dependencies', async () => {
    const tree = await migrationSchematicRunner
      .runSchematicAsync('update-4-0-0', {}, appTree)
      .toPromise();

    const packageJSONContent = readContent(tree, '/package.json');
    const packageJSON = JSON.parse(packageJSONContent);
    expect(packageJSON).toMatchInlineSnapshot(`
      Object {
        "devDependencies": Object {
          "@angular-eslint/builder": "^4.0.0",
          "@angular-eslint/eslint-plugin": "^4.0.0",
          "@angular-eslint/eslint-plugin-template": "^4.0.0",
          "@angular-eslint/template-parser": "^4.0.0",
        },
      }
    `);
  });
});
