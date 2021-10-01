import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import {
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectableSettings,
  SelectionEvent
} from '@progress/kendo-angular-grid';
import { GridAction } from '../../enums/grid-action.enum';
import { GridRequest } from '../../interfaces/grid';
import { MasterPage, PageData, PageGrid } from '../../interfaces/page';

@Component({
  selector: 'sp-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnChanges {
  @Input()
  page: MasterPage;
  @Input()
  isRoot: boolean;
  @Input()
  pageData: PageData;
  @Input()
  pageGrid: PageGrid;
  @Output()
  gridAction = new EventEmitter<GridRequest>();

  // for this example the columns are hardcoded here, but normally these are from definition files
  public columns: any[] = [
    { field: 'ProductID' },
    { field: 'ProductName' },
    { field: 'QuantityPerUnit' }
  ];
  public gridView: GridDataResult;
  public pagerSettings: any;
  public pageSizes: any;
  public pageSize: number;
  public skip = 0;
  public selectByField = '_id';
  public selectedKeys: Array<string> = [];
  public selectableSettings: SelectableSettings = {
    checkboxOnly: false,
    enabled: true,
    mode: 'single'
  };
  public localPageData: PageData;
  public localPageGrid: PageGrid;

  ngOnChanges() {
    this.localPageData = Object.assign({}, this.pageData);
    this.localPageGrid = Object.assign({}, this.pageGrid);

    if (this.localPageData.selectedJSDOId) {
      this.selectedKeys = [this.localPageData.selectedJSDOId];
    } else {
      this.selectedKeys = [];
    }
  }

  // Manual grid selection change event
  public selectionChange(event: SelectionEvent) {
    let row: RowArgs;
    if (event.selectedRows.length > 0) {
      row = event.selectedRows[0];
      if (Object.keys(row.dataItem).length > 0) {
        this.gridAction.emit({
          data: {
            dataItem: row.dataItem,
            isGrouped: false
          },
          gridAction: GridAction.SelectionChange
        });
      }
    }

    if (event.selectedRows.length === 0 && event.deselectedRows.length > 0) {
      this.gridAction.emit({
        data: {
          dataItem: undefined
        },
        gridAction: GridAction.SelectionChange
      });
    }
  }
}
