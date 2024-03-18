import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/no-pipe-impure';

type MessageIdType = 'noPipeImpure' | 'suggestRemovePipeImpure';

const NO_PIPE_IMPURE: MessageIdType = 'noPipeImpure';
const SUGGEST_REMOVE_PIPE_IMPURE: MessageIdType = 'suggestRemovePipeImpure';

export const VALID = [
  `class Test {}`,
  `
    @Pipe()
    class Test {}
  `,
  `
    @Pipe({})
    class Test {}
  `,
  `
    const options = {};
    @Pipe(options)
    class Test {}
  `,
  `
    @Pipe({
      name: 'test',
    })
    class Test {}
  `,
  `
    @Pipe({
      pure: true
    })
    class Test {}
  `,
  `
    @Pipe({
      pure: true,
    })
    class Test {}
  `,
  `
    const isPure = () => false;

    @Pipe({
      ['pure']: isPure(),
    })
    class Test {}
  `,
  `
    @NgModule({
      bootstrap: [Foo]
    })
    class Test {}
  `,
];

export const INVALID = [
  convertAnnotatedSourceToFailureCase({
    description: 'should fail if `pure` property is set to `false`',
    annotatedSource: `
      @Pipe({
        pure: false
        ~~~~~~~~~~~
      })
      class Test {}
    `,
    messageId: NO_PIPE_IMPURE,
    suggestions: [
      {
        messageId: SUGGEST_REMOVE_PIPE_IMPURE,
        output: `
      @Pipe({
        
