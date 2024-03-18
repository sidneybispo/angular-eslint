import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/utils';
import type { MessageIds } from '../../../src/rules/accessibility-label-has-associated-control';

const messageId: MessageIds = 'accessibilityLabelHasAssociatedControl';

export const validExamples = {
  'template-with-ngFor': `
    <ng-container *ngFor="let item of items; index as index">
      <label for="item-{{index}}">Label #{{index}}</label>
      <input id="item-{{index}}" [(ngModel)]="item.name">
    </ng-container>
    <label for="id"></label>
    <label [for]="id"></label>
    <label [attr.for]="id"></label>
    <label [htmlFor]="id"></label>
  `,
  'template-with-appLabel': `
    <app-label id="name"></app-label>
    <app-label [id]="name"></app-label>
    <label [htmlFor]="id"></label>
  `,
  'template-with-wrapped-input': `
    <label>
      Label
      <input>
    </label>
    <label>
      Label
      <span><input></span>
    </label>
    <app-label>
      <span>
        <app-input></app-input>
      </span>
    </app-label>
  `,
  'template-with-native-form-controls': `
    <label><input type="radio"></label>
    <label><meter></meter></label>
    <label><output></output></label>
    <label><progress></progress></label>
    <label><select><option>1</option></select></label>
    <label><textarea></textarea></label>
  `,
  'template-with-custom-component': `
    <a-label><input></a-label>
  `,
};

export const invalidExamples = {
  'label-without-for-attribute': convertAnnotatedSourceToFailureCase({
    messageId,
    description: 'should fail if a label does not have a "for" attribute',
    annotatedSource: `
      <label>Label</label>
      ~~~~~~~~~~~~~~~~~~~~
    `,
  }),
  'appLabel-without-label-attribute': convertAnnotatedSourceToFailureCase({
    messageId,
    description: 'should fail if a label component does not have a label attribute',
    annotatedSource: `
      <app-label anotherAttribute="id"></app-label>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    `,
    options: [{ labelComponents: [{ inputs: ['id'], selector: 'app-label' }] }],
  }),
};
