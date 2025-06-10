import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default withModuleFederation(
  {
    ...config,
    remotes: [
      ['examplePageRemoteOne', 'http://localhost:8082/examplePageRemoteOne'],
      ['examplePageRemoteTwo', 'http://localhost:8083/examplePageRemoteTwo'],
      ['examplePageRemoteThree', 'http://localhost:8084/examplePageRemoteThree'],
      ['examplePageRemoteFour', 'http://localhost:8085/examplePageRemoteFour'],
    ],
  },
  { dts: false }
);
