import { Component, Input, OnChanges } from '@angular/core';
import { PageForm, PageInfo } from '../../interfaces/page';

@Component({
  selector: 'sp-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnChanges {
  @Input()
  selectedData: any;
  @Input()
  pageInfo: PageInfo;

  public showSelectedData: Array<any> = [];

  ngOnChanges() {
    this.showSelectedData = [];

    this.showSelectedData.push(this.selectedData);
  }
}
