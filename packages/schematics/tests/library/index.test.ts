import * as angularDevkitSchematics from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { readJsonInTree } from '../../src/utils';
import { addPackageJsonDependency } from '@nrwl/tao/src/utils/lerna';

const { Tree } = angularDevkitSchematics;

jest.mock(
  '@angular-devkit/schematics',
  () =>
    ({
      ...jest.requireActual('@angular-devkit/schematics'),
      externalSchematic: jest.fn(),
    }),
);

const schematicRunner = new SchematicTestRunner(
  '@angular-eslint/schematics',
  path.join(__dirname, '../../src/collection.json'),
);

describe('library', () => {
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create('package.json', '{}');
    appTree.create(
      'angular.json',
      JSON.stringify({
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        newProjectRoot: 'projects',
        projects: {},
      }),
    );

    // Add missing dependency for @nrwl/tao
    addPackageJsonDependency(appTree, '@nrwl/tao', '13.6.2');
  });

  it('should pass all the given options directly to the @schematics/angular schematic', async () => {
    const spy = jest.spyOn(angularDevkitSchematics, 'externalSchematic');
    const options = {
      name: 'bar',
    };

    expect(spy).not.toHaveBeenCalled();

    await schematicRunner
      .runSchematicAsync('library', options, appTree)
      .toPromise();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      '@schematics/angular',
      'library',
      expect.objectContaining(options),
    );
  });

  // ... (other tests)
});
