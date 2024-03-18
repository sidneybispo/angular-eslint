import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'example'
})
export class ExamplePipe implements PipeTransform {
  transform(value: string, args?: string): string {
    if (!value) {
      return null;
    }
    // Add your custom transformation logic here
    // For example, converting the string to uppercase
    return value.toUpperCase();
  }
}
