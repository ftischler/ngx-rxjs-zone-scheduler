import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { NgxZoneScheduler } from 'ngx-rxjs-zone-scheduler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public demotext$: Observable<string>;

  constructor(private zoneScheduler: NgxZoneScheduler, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.demotext$ = of('This is the initial text');
  }

  public runChangeDetection(): void {
    this.changeDetectorRef.detectChanges();
  }

  public updateProducerOnNgZone(): void {
    const text = 'This text is updated on NgZone by the producer';
    this.demotext$ = of(text).pipe(
      tap(() => console.log(text)),
      delay(100, this.zoneScheduler.enterNgZone())
    );
  }

  public updateProducerOutOfNgZone(): void {
    const text = 'This text is updated out of NgZone by the producer';
    this.demotext$ = of(text).pipe(
      tap(() => console.log(text)),
      delay(100, this.zoneScheduler.leaveNgZone())
    );
  }

  public updateObserverOnNgZone(): void {
    const text = 'This text is updated out of NgZone by the producer and observed on NgZone';
    this.demotext$ = of(text).pipe(
      tap(() => console.log(text)),
      delay(100, this.zoneScheduler.leaveNgZone()),
      this.zoneScheduler.observeOnNgZone()
    );
  }

  public updateObserverOutOfNgZone(): void {
    const text = 'This text is updated out of NgZone by the producer and observed on NgZone';
    this.demotext$ = of(text).pipe(
      tap(() => console.log(text)),
      delay(100, this.zoneScheduler.enterNgZone()),
      this.zoneScheduler.observeOutOfNgZone()
    );
  }
}
