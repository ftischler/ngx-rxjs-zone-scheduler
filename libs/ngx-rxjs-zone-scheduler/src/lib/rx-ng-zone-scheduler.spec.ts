import { NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { delay, skip } from 'rxjs/operators';

import { RxNgZoneScheduler } from './rx-ng-zone-scheduler';

class MockNgZone {
  public run = jest.fn((fn) => this.ngZone.run(fn));
  public runOutsideAngular = jest.fn((fn) => this.ngZone.runOutsideAngular(fn));

  constructor(private ngZone: NgZone) {}
}

describe('RxNgZoneScheduler', () => {
  let mockNgZone: MockNgZone;
  let service: RxNgZoneScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MockNgZone, useClass: MockNgZone, deps: [NgZone] },
        {
          provide: RxNgZoneScheduler,
          useClass: RxNgZoneScheduler,
          deps: [MockNgZone],
        },
      ],
    });

    mockNgZone = TestBed.inject(MockNgZone);
    service = TestBed.inject(RxNgZoneScheduler);
  });

  describe('producers', () => {
    it('should call run on ngZone after 300ms delay', fakeAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(
        delay(300, service.enterNgZone())
      );

      test$.subscribe(() => {
        expect(mockNgZone.run).toHaveBeenCalledTimes(1);
        expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
      });

      tick(300);
    }));

    it('should call runOutsideAngular on ngZone after 300ms delay', fakeAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(
        delay(300, service.leaveNgZone())
      );

      test$.subscribe(() => {
        expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(1);
        expect(mockNgZone.run).not.toHaveBeenCalled();
      });

      tick(300);
    }));
  });

  describe('observeOn operators', () => {
    it('should call run on ngZone', waitForAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(service.observeOnNgZone());

      test$.subscribe(() => {
        expect(mockNgZone.run).toHaveBeenCalledTimes(2);
        expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should not re-enter the Angular zone if the value has been emitted within the Angular zone', waitForAsync(() => {
      expect.hasAssertions();

      const test$ = new Subject<string>();

      test$.pipe(service.observeOnNgZone(), skip(1)).subscribe(() => {
        // Previously, it would've been called 3 times, since we call it manually through `mockNgZone.run`
        // and the `EnterZoneScheduler` would've called it 2 times.
        expect(mockNgZone.run).toHaveBeenCalledTimes(2);
      });

      mockNgZone.run(() => test$.next('within the Angular zone'));
      mockNgZone.runOutsideAngular(() =>
        test$.next('outside of the Angular zone')
      );
    }));

    it('should call runOutsideAngular on ngZone', waitForAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(service.observeOutOfNgZone());

      test$.subscribe(() => {
        expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(2);
        expect(mockNgZone.run).not.toHaveBeenCalled();
      });
    }));
  });

  describe('subscribeOn operators', () => {
    it('should call run on ngZone', waitForAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(service.subscribeOnNgZone());

      test$.subscribe(() => {
        expect(mockNgZone.run).toHaveBeenCalledTimes(1);
        expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should call runOutsideAngular on ngZone', waitForAsync(() => {
      expect.hasAssertions();

      const test$ = of('this is a test').pipe(service.subscribeOutOfNgZone());

      test$.subscribe(() => {
        expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(1);
        expect(mockNgZone.run).not.toHaveBeenCalled();
      });
    }));
  });
});
