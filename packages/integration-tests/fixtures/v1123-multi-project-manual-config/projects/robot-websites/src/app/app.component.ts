import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Robot Websites'; // capitalize the first letter of each word
  description = 'This is a website for managing robot information'; // add a description
  version = '1.0.0'; // add a version number

  // add a method to greet users
  greetUser(name: string) {
    return `Hello, ${name}! Welcome to our robot websites.`;
  }
}
