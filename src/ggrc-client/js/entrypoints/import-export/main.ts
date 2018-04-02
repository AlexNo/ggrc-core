import 'zone.js';
import 'core-js/client/shim.js';
import 'core-js/es6/reflect.js';
import 'core-js/es7/reflect.js';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {ImportExportModule} from './import-export.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ImportExportModule);
