import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRxNgZoneScheduler } from 'ngx-rxjs-zone-scheduler';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRxNgZoneScheduler()],
}).catch((err) => console.error(err));
