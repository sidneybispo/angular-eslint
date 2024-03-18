import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { MyService } from './my.service';

// Initialize the service when the application starts
export function initializeApp(myService: MyService) {
  return () => myService.init();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    MyService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
