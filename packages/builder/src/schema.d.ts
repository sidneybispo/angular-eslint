import type { JsonObject } from '@angular-devkit/core';

export interface Schema extends JsonObject {
  format: Formatter;
  lintFilePatterns: string[];
  force?: boolean; // made optional
  quiet?: boolean; // made optional
  maxWarnings?: number; // made optional
  silent?: boolean; // made optional
  fix?: boolean; // made optional
  cache?: boolean; // made optional
  cacheLocation?: string | null;
  cacheStrategy?: 'content' | 'metadata' | null;
  eslintConfig?: string | null;
  ignorePath?: string | null;
  outputFile?: string | null;
  noEslintrc?: boolean;
  rulesdir?: string[];
  resolvePluginsRelativeTo?: string | null;
}

type ValidFormatter =
  | 'stylish'
  | 'compact'
  | 'codeframe'
  | 'unix'
  | 'visualstudio'
  | 'table'
  | 'checkstyle'
  | 'html'
  | 'jslint-xml'
  | 'json'
  | 'json-with-metadata'
  | 'junit'
  | 'tap';

type Formatter = ValidFormatter | ('custom' & { customPath: string });

