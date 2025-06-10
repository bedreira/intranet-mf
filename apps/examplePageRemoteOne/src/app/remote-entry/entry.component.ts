import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplePageLibOneComponent } from '@intranet-mf/examplePageLibOne';

@Component({
  imports: [CommonModule, ExamplePageLibOneComponent],
  selector: 'intranet-mf-examplePageRemoteOne-entry',
  template: `<lib-example-page-lib-one></lib-example-page-lib-one>`,
})
export class RemoteEntryComponent {}
