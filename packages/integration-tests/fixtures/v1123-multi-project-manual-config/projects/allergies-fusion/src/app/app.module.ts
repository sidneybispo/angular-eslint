// Import necessary Angular modules and components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import the AppComponent
import { AppComponent } from './app.component';

// Import a sample component to demonstrate how to add components to the module
import { SampleComponent } from './sample/sample.component';

@NgModule({
  // Declare the components that belong to this module
  declarations: [
    AppComponent,
    SampleComponent
  ],
  // Import any Angular modules needed by these components
  imports: [
    BrowserModule
  ],
  // Provide any services needed by these components
  providers: [],
  // Specify the component to bootstrap when this module is loaded
  bootstrap: [AppComponent]
})
export class AppModule { }

/*
In this example, we added a SampleComponent to the declarations array,
imported it at the top, and added a corresponding file at
src/app/sample/sample.component.ts. This is just a sample, and you can
add as many components as you need, following the same pattern.
*/
