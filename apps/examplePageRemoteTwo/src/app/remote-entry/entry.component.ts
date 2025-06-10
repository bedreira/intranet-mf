import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplePageLibTwoComponent } from '@intranet-mf/examplePageLibTwo';

@Component({
  imports: [CommonModule, ExamplePageLibTwoComponent],
  selector: 'intranet-mf-examplePageRemoteTwo-entry',
  template: `<lib-example-page-lib-two></lib-example-page-lib-two>`,
})
export class RemoteEntryComponent {}
