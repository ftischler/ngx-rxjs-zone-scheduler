import { NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { RxNgZoneScheduler } from './rx-ng-zone-scheduler';

class MockNgZone {
  public run = jest.fn((fn) => this.ngZone.run(fn)).mockName('run');
  public runOutsideAngular = jest
    .fn((fn) => this.ngZone.runOutsideAngular(fn))
    .mockName('runOutsideAngular');

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
    it(
      'should call run on ngZone',
      waitForAsync(() => {
        expect.hasAssertions();

        const test$ = of('this is a test').pipe(service.observeOnNgZone());

        test$.subscribe(() => {
          expect(mockNgZone.run).toHaveBeenCalledTimes(2);
          expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
        });
      })
    );

    it(
      'should call runOutsideAngular on ngZone',
      waitForAsync(() => {
        expect.hasAssertions();

        const test$ = of('this is a test').pipe(service.observeOutOfNgZone());

        test$.subscribe(() => {
          expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(2);
          expect(mockNgZone.run).not.toHaveBeenCalled();
        });
      })
    );
  });

  describe('subscribeOn operators', () => {
    it(
      'should call run on ngZone',
      waitForAsync(() => {
        expect.hasAssertions();

        const test$ = of('this is a test').pipe(service.subscribeOnNgZone());

        test$.subscribe(() => {
          expect(mockNgZone.run).toHaveBeenCalledTimes(1);
          expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
        });
      })
    );

    it(
      'should call runOutsideAngular on ngZone',
      waitForAsync(() => {
        expect.hasAssertions();

        const test$ = of('this is a test').pipe(service.subscribeOutOfNgZone());

        test$.subscribe(() => {
          expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(1);
          expect(mockNgZone.run).not.toHaveBeenCalled();
        });
      })
    );
  });
});
