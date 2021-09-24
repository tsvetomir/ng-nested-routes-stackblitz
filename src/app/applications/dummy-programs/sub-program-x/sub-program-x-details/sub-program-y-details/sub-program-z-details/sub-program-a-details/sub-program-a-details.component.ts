import { Component } from '@angular/core';
import { DetailPage } from '../../../../../../../company/interfaces/page';
import { SubProgramADetailsDefinition } from './sub-program-a-details.definition';

@Component({
  template: `
    <sp-detail-page [page]="page" [outletKey]="key"></sp-detail-page>
  `
})
export class SubProgramAComponent {
  page: DetailPage;
  key: string;

  constructor() {
    this.key = 'grid1';
    this.page = SubProgramADetailsDefinition;
  }
}
