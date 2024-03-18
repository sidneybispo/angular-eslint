import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/prefer-output-readonly';

const PREFER_OUTPUT_READONLY: MessageIds = 'preferOutputReadonly';
const SUGGEST_ADD_READONLY_MODIFIER: MessageIds = 'suggestAddReadonlyModifier';

export const validCodeExamples = [
  `
    class Test {
      testEmitter = new EventEmitter<string>();
    }
    `,
  `
    class Test {
      @Output() readonly testEmitter = new EventEmitter<string>();
    }
    `,
];

export const invalidCodeExamples = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail when an @Output is not readonly',
    annotatedSource: `
        class Test {
          @Output() testEmitter = new EventEmitter<string>();
                    ~~~~~~~~~~~
        }
      `,
    messageId: PREFER_OUTPUT_READONLY,
    suggestions: [
      {
        messageId: SUGGEST_ADD_READONLY_MODIFIER,
        output: `
        class Test {
          @Output() readonly testEmitter = new EventEmitter<string>();
                    
        }
      `,
      },
    ],
  }),
];
