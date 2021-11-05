# NgxRxjsZoneScheduler

## Library

[Documentation and code here](https://github.com/ftischler/ngx-rxjs-zone-scheduler/blob/main/libs/ngx-rxjs-zone-scheduler)

## Demo app
[Code here](https://github.com/ftischler/ngx-rxjs-zone-scheduler/blob/main/apps/demo-app)

## Installation
`npm install ngx-rxjs-zone-scheduler --save` or
`yarn add ngx-rxjs-zone-scheduler`

## Publishing a new version
- Increment the version in root [package.json](package.json) and [libs/ngx-rxjs-zone-scheduler/package.json](libs/ngx-rxjs-zone-scheduler/package.json)
- `yarn build`
- `cd dist/libs/ngx-rxjs-zone-scheduler && npm pack`
- `npm publish ngx-rxjs-zone-scheduler-<VERSION>.tgz`
