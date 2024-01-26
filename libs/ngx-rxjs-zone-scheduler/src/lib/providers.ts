import { makeEnvironmentProviders } from '@angular/core';
import { RxNgZoneScheduler } from './rx-ng-zone-scheduler';

export const provideRxNgZoneScheduler = () =>
  makeEnvironmentProviders([RxNgZoneScheduler]);
