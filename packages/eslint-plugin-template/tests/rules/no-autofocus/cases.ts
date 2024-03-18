import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/no-autofocus';

const messageId: MessageIds = 'noAutofocus';

export const validElements = {
  input: '<input type="text">',
  textarea: '<textarea autoFocus></textarea>',
  div: '<div [autoFocus]="true"></div>',
  buttonWithAppAutofocus: '<button [appautofocus]="false">Click me!</button>',
  customComponent: '<app-drag-drop autofocus></app-drag-drop>',
  customComponentWithBinding: '<app-textarea [autofocus]="false"></app-textarea>',
};

export const invalidElements = {
  button: convertAnnotatedSourceToFailureCase({
    description: 'should fail if `autofocus` attribute is present',
    annotatedSource: `
        <button autofocus>Click me!</button>
                ~~~~~~~~~
      `,
    messageId,
    annotatedOutput: `
        <button>Click me!</button>
                ~~~~~~~~~
      `,
  }),
  inputWithAttrBinding: convertAnnotatedSourceToFailureCase({
    description: 'should fail if `autofocus` attribute binding is present',
    annotatedSource: `
        <input [attr.autofocus]="false">
               ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
    messageId,
    annotatedOutput: `
        <input>
               ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
  }),
  customComponentWithInputBinding: convertAnnotatedSourceToFailureCase({
    description: 'should fail if `autofocus` input binding is present',
    annotatedSource: `
        <app-test [autofocus]="true"></app-test>
        <select autofocus></select>
                ~~~~~~~~~
      `,
    messageId,
    annotatedOutput: `
        <app-test [autofocus]="true"></app-test>
        <select></select>
                ~~~~~~~~~
      `,
  }),
};
