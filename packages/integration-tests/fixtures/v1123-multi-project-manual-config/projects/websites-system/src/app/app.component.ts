import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Websites System'; // use string type and title case
  description: string = 'This is the root component of the Websites System.'; // add a description
  version: string = '1.0.0'; // add a version number

  // add a method to change the title
  changeTitle(newTitle: string) {
    this.title = newTitle;
  }
}


<!-- app.component.html -->
<h1>{{ title }}</h1> <!-- use interpolation to display the title -->
<p>{{ description }}</p> <!-- display the description -->
<button (click)="changeTitle('New Title')">Change Title</button> <!-- add a button to change the title -->
<router-outlet></router-outlet> <!-- display the routed component -->


/* app.component.css */
h1 {
  color: blue; /* add some style to the title */
}
