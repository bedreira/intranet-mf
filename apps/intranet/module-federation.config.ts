import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'intranet',
  /**
   * To use a remote that does not exist in your current Nx Workspace
   * You can use the tuple-syntax to define your remote
   *
   * remotes: [['my-external-remote', 'https://nx-angular-remote.netlify.app']]
   *
   * You _may_ need to add a `remotes.d.ts` file to your `src/` folder declaring the external remote for tsc, with the
   * following content:
   *
   * declare module 'my-external-remote';
   *
   */
  remotes: [
    'examplePageRemoteOne',
    'examplePageRemoteTwo',
    'examplePageRemoteThree',
    'examplePageRemoteFour',
  ],  
  shared: (libraryName, sharedConfig) => {
    if (
      libraryName === '@angular/core' ||
      libraryName === '@angular/common' ||
      libraryName === '@angular/platform-browser' ||
      libraryName === '@angular/router' ||
      libraryName === '@angular/animations' ||
      libraryName === '@angular/forms' ||
      libraryName === '@angular/http' ||
      libraryName === '@angular/material' ||
      libraryName === '@angular/cdk' ||
      libraryName === '@angular/flex-layout' ||
      libraryName === '@angular/cdk' ||
      libraryName === '@angular/flex-layout' ||
      libraryName === '@angular/common/http'
    ) {
      return { ...sharedConfig, requiredVersion: false, singleton: true, eager: true };
    }
    return sharedConfig;
  },

};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
