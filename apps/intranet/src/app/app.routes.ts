import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { AppComponent } from './app.component';


export const appRoutes: Route[] = [
  {
    path: 'examplePageRemoteOne',
    loadChildren: () =>
      loadRemoteModule('examplePageRemoteOne', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: 'examplePageRemoteTwo',
    loadChildren: () =>
      loadRemoteModule('examplePageRemoteTwo', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: 'examplePageRemoteThree',
    loadChildren: () =>
      loadRemoteModule('examplePageRemoteThree', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: 'examplePageRemoteFour',
    loadChildren: () =>
      loadRemoteModule('examplePageRemoteFour', './Routes').then(
        (m) => m.remoteRoutes
      ),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
