import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxZoneSchedulerModule } from 'ngx-rxjs-zone-scheduler';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxZoneSchedulerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
