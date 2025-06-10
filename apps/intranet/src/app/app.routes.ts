import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'examplePageRemoteFour',
    loadChildren: () =>
      import('examplePageRemoteFour/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'examplePageRemoteThree',
    loadChildren: () =>
      import('examplePageRemoteThree/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'examplePageRemoteTwo',
    loadChildren: () =>
      import('examplePageRemoteTwo/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: 'examplePageRemoteOne',
    loadChildren: () =>
      import('examplePageRemoteOne/Routes').then((m) => m!.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
