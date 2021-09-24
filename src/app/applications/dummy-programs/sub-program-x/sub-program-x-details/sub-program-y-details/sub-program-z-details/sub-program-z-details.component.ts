import { Component } from '@angular/core';
import { DetailPage } from '../../../../../../company/interfaces/page';
import { SubProgramZDetailsDefinition } from './sub-program-z-details.definition';

@Component({
  template: `
    <sp-detail-page [page]="page" [outletKey]="key"></sp-detail-page>
  `
})
export class SubProgramZComponent {
  page: DetailPage;
  key: string;

  constructor() {
    this.key = 'grid1';
    this.page = SubProgramZDetailsDefinition;
  }
}
