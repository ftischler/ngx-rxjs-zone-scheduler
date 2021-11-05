import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RxNgZoneSchedulerModule } from 'ngx-rxjs-zone-scheduler';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RxNgZoneSchedulerModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
