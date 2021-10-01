import { Component, Input, OnInit } from '@angular/core';
import { DetailPage, PageForm, PageGrid } from '../../interfaces/page';
import { SelectedDataService } from '../../services/selected-data.service';

@Component({
  selector: 'sp-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {
  @Input()
  page: DetailPage;
  @Input()
  public form: PageForm;
  public grids: Array<{ key: string; grid: PageGrid }> = [];
  public selectedData: any;

  constructor(private selectedDataService: SelectedDataService) {}

  ngOnInit() {
    this.selectedDataService.selectedData$.subscribe(selectedData => {
      this.selectedData = selectedData;
    });

    if (this.page) {
      if (this.page.pageForm) {
        this.form = this.page.pageForm;
      }

      if (this.page.pageGrids) {
        this.page.pageGrids.forEach((grid, index) => {
          this.grids.push({
            key: 'grid' + (index + 1),
            grid: grid
          });
        });
      }
    }
  }
}
