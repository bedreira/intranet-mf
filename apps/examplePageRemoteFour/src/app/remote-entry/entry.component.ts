import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplePageLibFourComponent } from '@intranet-mf/examplePageLibFour';

@Component({
  imports: [CommonModule, ExamplePageLibFourComponent],
  selector: 'intranet-mf-examplePageRemoteFour-entry',
  template: `<lib-example-page-lib-four></lib-example-page-lib-four>`,
})
export class RemoteEntryComponent {}
