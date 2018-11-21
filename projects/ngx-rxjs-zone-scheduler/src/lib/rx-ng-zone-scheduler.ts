import { Injectable, NgZone } from '@angular/core';
import { asyncScheduler, MonoTypeOperatorFunction, SchedulerLike, Subscription } from 'rxjs';
import { observeOn, subscribeOn } from 'rxjs/operators';

abstract class ZoneScheduler implements SchedulerLike {
  constructor(protected ngZone: NgZone, protected scheduler: SchedulerLike) { }

  abstract schedule(...args: unknown[]): Subscription;

  public now(): number {
    return this.scheduler.now();
  }
}

class LeaveZoneScheduler extends ZoneScheduler {
  public schedule(...args: unknown[]): Subscription {
    return this.ngZone.runOutsideAngular(() => {
      return this.scheduler.schedule.apply(this.scheduler, args);
    });
  }
}

class EnterZoneScheduler extends ZoneScheduler {
  public schedule(...args: unknown[]): Subscription {
    return this.ngZone.run(() => {
      return this.scheduler.schedule.apply(this.scheduler, args);
    });
  }
}

export function enterNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
  return new EnterZoneScheduler(ngZone, scheduler);
}

export function leaveNgZone(ngZone: NgZone, scheduler: SchedulerLike = asyncScheduler): SchedulerLike {
  return new LeaveZoneScheduler(ngZone, scheduler);
}

@Injectable()
export class RxNgZoneScheduler {
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
