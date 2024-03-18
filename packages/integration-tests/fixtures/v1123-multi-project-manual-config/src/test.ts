// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Use fs to read all the test files
import * as fs from 'fs';
const testFiles: string[] = fs.readdirSync('./').filter(file => file.endsWith('.spec.ts'));

// Load the modules.
testFiles.forEach(file => TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
  .initializeTestEnvironment(
    browser.createInstrumentationBackend(),
    {
      logger: TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()).getLoggingService(),
      bayeux: false,
      path: file,
      styles: [],
      scripts: [],
      providers: []
    },
    {}
  ).compileComponents());
