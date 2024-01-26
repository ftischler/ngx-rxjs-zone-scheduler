# ngx-rxjs-zone-scheduler

A library for Angular providing rxjs schedulers to run some kind of work inside or outside of `NgZone`.

## Purpose

Sometimes in Angular you need to decide if a task should run inside or outside of `NgZone`.
Usually this is possible by injecting `NgZone`:

```typescript
import { Component, inject, NgZone, OnInit } from '@angular/core';

@Component({
  // ...
})
export class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.run(() => {
      /* run inside NgZone */
    });
    this.ngZone.runOutsideAngular(() => {
      /* run outside NgZone */
    });
    // ...
  }
}
```

This is a simple library to wrap this functionality into a rxjs scheduler in order to use it directly with rxjs `Observable`.

## Installation

`npm install ngx-rxjs-zone-scheduler --save` or
`yarn add ngx-rxjs-zone-scheduler`

## Usage

Provide `RxNgZoneScheduler` via `provideRxNgZoneScheduler()` in your `applicationConfig` or `main.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRxNgZoneScheduler } from 'ngx-rxjs-zone-scheduler';
// ...
providers: [
  // ...
  provideRxNgZoneScheduler(),
];
// ...
```

Now you can inject `RxNgZoneScheduler` in your services or components:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { RxNgZoneScheduler } from 'ngx-rxjs-zone-scheduler';

@Component({
  // ...
})
export class AppComponent implements OnInit {
  public demotext1$: Observable<string>;
  public demotext2$: Observable<string>;
  public demotext3$: Observable<string>;
  public demotext4$: Observable<string>;

  private zoneScheduler = inject(RxNgZoneScheduler);

  ngOnInit() {
    // Usage of pipeable operators as wrappers for observeOn and subscribeOn:

    this.demotext1$ = of('This is the initial text').pipe(
      this.zoneScheduler.observeOutOfNgZone() // To observe outside of NgZone - like runOutsideAngular()
    );

    this.demotext2$ = of('This is the initial text').pipe(
      this.zoneScheduler.observeOnNgZone() // To observe inside of NgZone - like run()
    );

    // Direct usage of the scheduler:
    this.demotext3$ = of('This is the initial text').pipe(
      delay(100, this.zoneScheduler.leaveNgZone()) // To produce outside of NgZone - like runOutsideAngular()
    );

    this.demotext4$ = of('This is the initial text').pipe(
      delay(100, this.zoneScheduler.enterNgZone()) // To produce inside of NgZone - like run()
    );
  }

  // ...
}
```

It is also possible to use the schedulers without importing RxNgZoneSchedulerModule:

```typescript
import { Component, OnInit, NgZone, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, observeOn } from 'rxjs/operators';

import { enterNgZone, leaveNgZone } from 'ngx-rxjs-zone-scheduler';

@Component({
  // ...
})
export class AppComponent implements OnInit {
  public demotext1$: Observable<string>;
  public demotext2$: Observable<string>;

  private ngZone = inject(NgZone);

  ngOnInit() {
    this.demotext1$ = of('This is the initial text').pipe(
      observeOn(enterNgZone(this.ngZone))
    );

    this.demotext2$ = of('This is the initial text').pipe(
      observeOn(leaveNgZone(this.ngZone))
    );
  }

  // ...
}
```
