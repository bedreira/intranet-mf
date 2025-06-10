import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamplePageLibThreeComponent } from '@intranet-mf/examplePageLibThree';

@Component({
  imports: [CommonModule, ExamplePageLibThreeComponent],
  selector: 'intranet-mf-examplePageRemoteThree-entry',
  template: `<lib-example-page-lib-three></lib-example-page-lib-three>`,
})
export class RemoteEntryComponent {}
