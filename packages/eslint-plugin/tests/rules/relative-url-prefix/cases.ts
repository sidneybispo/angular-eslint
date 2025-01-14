import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/relative-url-prefix';

const relativeUrlPrefix: MessageIds = 'relativeUrlPrefix';

const valid = [
  [`
    @Component({
      styleUrls: [
        './foo.css',
        '../bar.css',
        '../../baz.scss',
        '../../../baz.sass',
        './../test.css',
        '.././angular.sass'
      ]
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: './foobar.html'
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: '../foobar.html'
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: '../../foobar.html'
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: '../../../foobar.html'
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: './../foobar.html'
    })
    class Test {}
    `,],
  [`
    @Component({
      templateUrl: '.././foobar.html'
    })
    class Test {}
    `,],
];

const invalid = [
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail if one of "styleUrls" is absolute',
    annotatedSource: `
        @Component({
          styleUrls: ['./foo.css', 'bar.css', '../baz.scss', '../../test.css']
                                   ~~~~~~~~~
        })
        class Test {}
      `,
    messageId: relativeUrlPrefix,
  }),
  convertAnnotatedSourceToFailureCase({
    description: 'it should fail if "templateUrl" is absolute',
    annotatedSource: `
        @Component({
          templateUrl: 'foobar.html'
                       ~~~~~~~~~~~~~
        })
        class Test {}
      `
