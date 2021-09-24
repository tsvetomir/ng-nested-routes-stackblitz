import { Component } from '@angular/core';
import { DetailPage } from '../../../../../company/interfaces/page';
import { SubProgramYDetailsDefinition } from './sub-program-y-details.definition';

@Component({
  template: `
    <sp-detail-page [page]="page" [outletKey]="key"></sp-detail-page>
  `
})
export class SubProgramYComponent {
  page: DetailPage;
  key: string;

  constructor() {
    this.key = 'grid1';
    this.page = SubProgramYDetailsDefinition;
  }
}
