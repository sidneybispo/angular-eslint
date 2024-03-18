// Import necessary Angular modules and components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import the AppComponent
import { AppComponent } from './app.component';

// Define the AppModule
@NgModule({
  // List of components that belong to this module
  declarations: [
    AppComponent
  ],
  // List of modules that this module depends on
  imports: [
    BrowserModule
  ],
  // List of services that this module provides
  providers: [],
  // The root component of the application
  bootstrap: [AppComponent]
})
export class AppModule { }

// Define a sample component
import { Component } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: `
    <h1>This is a sample component</h1>
    <p>You can add more HTML here</p>
  `
})
export class SampleComponent { }
