import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err: any) => {
    console.error(err);
    // You might want to consider adding a more sophisticated error handling here,
    // like showing a user-friendly error message or sending an error report.
  });
