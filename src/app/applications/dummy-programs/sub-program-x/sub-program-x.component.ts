import { Component } from '@angular/core';
import { SubProgramXDefinition } from './sub-program-x.definition';

@Component({
  template: `
    <sp-master-page
      [page]="page"
      [pageGrid]="page.pageGrid"
      [isRoot]="'true'"
    ></sp-master-page>
  `
})
export class SubProgramXComponent {
  page = SubProgramXDefinition;
}
