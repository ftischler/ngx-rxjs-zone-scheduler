import { Injectable, NgZone } from '@angular/core';
import { asyncScheduler, MonoTypeOperatorFunction, SchedulerLike, Subscription } from 'rxjs';
import { observeOn, subscribeOn } from 'rxjs/operators';

class LeaveZoneScheduler implements SchedulerLike {
  constructor(private ngZone: NgZone, private scheduler: SchedulerLike) { }

  schedule(...args: any[]): Subscription {
    return this.ngZone.runOutsideAngular(() => {
      return this.scheduler.schedule.apply(this.scheduler, args);
    });
  }

  now(): number {
    return 0;
  }
}

class EnterZoneScheduler implements SchedulerLike {
  constructor(private zone: NgZone, private scheduler: SchedulerLike) { }

  schedule(...args: any[]): Subscription {
    return this.zone.run(() => {
      return this.scheduler.schedule.apply(this.scheduler, args);
    });
  }

  now(): number {
    return 0;
  }
}

export function enterNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
  return new EnterZoneScheduler(ngZone, scheduler);
}

export function leaveNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
  return new LeaveZoneScheduler(ngZone, scheduler);
}

@Injectable()
export class NgxZoneScheduler {
  constructor(private ngZone: NgZone) { }

  public observeOnNgZone<T>(): MonoTypeOperatorFunction<T> {
    return observeOn<T>(this.enterNgZone());
  }

  public observeOutOfNgZone<T>(): MonoTypeOperatorFunction<T> {
    return observeOn<T>(this.leaveNgZone());
  }

  public subscribeOnNgZone<T>(): MonoTypeOperatorFunction<T> {
    return subscribeOn<T>(this.enterNgZone());
  }

  public subscribeOutOfNgZone<T>(): MonoTypeOperatorFunction<T> {
    return subscribeOn<T>(this.leaveNgZone());
  }

  public enterNgZone(scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
    return enterNgZone(this.ngZone, scheduler);
  }

  public leaveNgZone(scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
    return leaveNgZone(this.ngZone, scheduler);
  }
}
