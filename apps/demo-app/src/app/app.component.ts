import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { RxNgZoneScheduler } from 'ngx-rxjs-zone-scheduler';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
    selector: 'ngx-rxjs-zone-scheduler-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [AsyncPipe, NgIf]
})
export class AppComponent implements OnInit {
  public demotext$?: Observable<string>;

  constructor(private zoneScheduler: RxNgZoneScheduler) {}

  ngOnInit() {
    this.demotext$ = of('This is the initial text');
  }

  public runChangeDetection(): boolean {
    // Button click event will trigger change detection.
    return true;
  }

  public updateProducerOnNgZone(): void {
    const text = 'This text is updated on NgZone by the producer';
    this.demotext$ = of(text).pipe(
      delay(500, this.zoneScheduler.enterNgZone()),
      tap(() => console.log(text))
    );
  }

  public updateProducerOutOfNgZone(): void {
    const text = 'This text is updated out of NgZone by the producer';
    this.demotext$ = of(text).pipe(
      delay(500, this.zoneScheduler.leaveNgZone()),
      tap(() => console.log(text))
    );
  }

  public updateObserverOnNgZone(): void {
    const text =
      'This text is updated out of NgZone by the producer and observed on NgZone';
    this.demotext$ = of(text).pipe(
      delay(500, this.zoneScheduler.leaveNgZone()),
      this.zoneScheduler.observeOnNgZone(),
      tap(() => console.log(text))
    );
  }

  public updateObserverOutOfNgZone(): void {
    const text =
      'This text is updated out of NgZone by the producer and observed on NgZone';
    this.demotext$ = of(text).pipe(
      delay(500, this.zoneScheduler.enterNgZone()),
      this.zoneScheduler.observeOutOfNgZone(),
      tap(() => console.log(text))
    );
  }
}
