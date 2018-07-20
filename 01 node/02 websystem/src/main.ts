import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { LicenseManager } from 'ag-grid-enterprise/main';
LicenseManager.setLicenseKey('WINS_MultiApp_1Devs28_July_2018__MTUzMjczMjQwMDAwMA==dd60a5accf2d2e3b29d7384309391498');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
