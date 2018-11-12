import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RxNgZoneScheduler } from './rx-ng-zone-scheduler';
import { NgZone } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import Spy = jasmine.Spy;

class MockNgZone {
  public run: Spy = jasmine.createSpy('run').and.callFake(fn => this.ngZone.run(fn));
  public runOutsideAngular: Spy = jasmine.createSpy('runOutsideAngular').and.callFake(fn => this.ngZone.runOutsideAngular(fn));

  constructor(private ngZone: NgZone) { }
}

describe('RxNgZoneScheduler', () => {
  let mockNgZone: MockNgZone;
  let service: RxNgZoneScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: MockNgZone, useClass: MockNgZone, deps: [NgZone]},
        {provide: RxNgZoneScheduler, useClass: RxNgZoneScheduler, deps: [MockNgZone]}
      ]
    });

    mockNgZone = TestBed.get(MockNgZone);
    service = TestBed.get(RxNgZoneScheduler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('producers', () => {
    it('should call run on ngZone after 300ms delay', fakeAsync(() => {
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
    it('should call run on ngZone', async(() => {
      const test$ = of('this is a test').pipe(
        service.observeOnNgZone()
      );

      test$.subscribe(() => {
        expect(mockNgZone.run).toHaveBeenCalledTimes(2);
        expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should call runOutsideAngular on ngZone', async(() => {
      const test$ = of('this is a test').pipe(
        service.observeOutOfNgZone()
      );

      test$.subscribe(() => {
        expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(2);
        expect(mockNgZone.run).not.toHaveBeenCalled();
      });
    }));
  });

  describe('subscribeOn operators', () => {
    it('should call run on ngZone', async(() => {
      const test$ = of('this is a test').pipe(
        service.subscribeOnNgZone()
      );

      test$.subscribe(() => {
        expect(mockNgZone.run).toHaveBeenCalledTimes(1);
        expect(mockNgZone.runOutsideAngular).not.toHaveBeenCalled();
      });
    }));

    it('should call runOutsideAngular on ngZone', async(() => {
      const test$ = of('this is a test').pipe(
        service.subscribeOutOfNgZone()
      );

      test$.subscribe(() => {
        expect(mockNgZone.runOutsideAngular).toHaveBeenCalledTimes(1);
        expect(mockNgZone.run).not.toHaveBeenCalled();
      });
    }));
  });
});
