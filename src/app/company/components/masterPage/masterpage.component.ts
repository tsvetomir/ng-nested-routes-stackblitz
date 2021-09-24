import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { State } from "@progress/kendo-data-query";
import { products } from "../../../products";
import { parseUrlPathInSegments } from "../../classes/url-path-parser";
import { GridAction } from "../../enums/grid-action.enum";
import { GridRequest } from "../../interfaces/grid";
import {
  Childpage,
  MasterPage,
  PageData,
  PageGrid,
} from "../../interfaces/page";
import { SelectedDataService } from "../../services/selected-data.service";

@Component({
  selector: "sp-master-page",
  templateUrl: "./masterpage.component.html",
  styleUrls: ["./masterpage.component.scss"],
})
export class MasterPageComponent implements OnChanges, OnInit {
  @Input()
  page: MasterPage;
  @Input()
  pageGrid: PageGrid;
  @Input()
  isRoot: boolean;
  @Input()
  outletKey: string;

  public localChilds: Array<Childpage>;
  public localPageData: PageData;
  public localPageGrid: PageGrid;
  public activePath = "";
  public queryParamsState: any = {};

  private queryParamsRow: any = {};
  private subscribers: any = {};

  constructor(
    private router: Router,
    private selectedDataService: SelectedDataService
  ) {}

  ngOnChanges() {
    this.localPageGrid = Object.assign({}, this.pageGrid);

    this.localPageData = {
      dataItems: {
        countExact: true,
        data: [],
        total: 0,
      },
      state: {
        filter: {
          logic: "and",
          filters: [],
        },
      },
    };

    this.localPageGrid.defaultPagerSize = 15;

    if (!this.localPageData.state.take) {
      this.localPageData.state.take = this.localPageGrid.defaultPagerSize;
    }

    if (!this.localPageData.state.skip) {
      this.localPageData.state.skip = 0;
    }

    // normally the data is fetched by unique source from definition file,
    // now all the grids have same data for example purpose
    this.localPageData.dataItems.data = products as any;
    this.localPageData.dataItems.total = products.length;
  }

  ngOnInit() {
    this.localChilds = Object.assign([], this.localPageGrid.childs);

    this.subscribers.routerSubscription = this.router.events.subscribe(
      (routerEvent: any) => {
        if (routerEvent instanceof NavigationEnd) {
          // this.ignoreParamChange = false;
          this.setActivePath();
        }
      }
    );
  }

  // Switch to correct grid action from grid
  public gridAction(gridRequest: GridRequest) {
    switch (gridRequest.gridAction) {
      case GridAction.SelectionChange: {
        this.selectionChangedManual(gridRequest.data);
        break;
      }
      default: {
        break;
      }
    }
  }

  // Manual selection change (grid row click)
  private async selectionChangedManual(dataWrapper: any) {
    const copyLocalPageData: PageData = Object.assign({}, this.localPageData);
    copyLocalPageData.selectedJSDOId = dataWrapper.dataItem
      ? dataWrapper.dataItem["ProductID"]
      : undefined;

    // Create optional query params
    const queryParamsRow = this.createQueryParamsRowFromRowAndKeys(
      dataWrapper.dataItem,
      ["ProductID"]
    );
    let queryParamsState = {};
    if (this.localPageGrid.defaultPagerSize) {
      queryParamsState = this.createQueryParamsFromState(
        this.localPageData.state
      );
    }
    const queryParams = Object.assign(queryParamsRow, queryParamsState);

    let childPath = "";
    if (this.localChilds && this.localChilds.length > 0) {
      if (!this.activePath) {
        childPath = this.localChilds[0].path;
      } else {
        childPath = this.activePath;
      }
    }

    if (!dataWrapper.dataItem) {
      childPath = "none";
    }
    const browseResult = await this.navigateToNewURL(queryParams, childPath);

    if (browseResult) {
      this.queryParamsRow = queryParamsRow;
      this.queryParamsState = queryParamsState;
      this.localPageData = Object.assign({}, copyLocalPageData);
    } else {
      this.localPageData = Object.assign({}, this.localPageData);
    }

    this.selectedDataService.selectedData(dataWrapper.dataItem);
  }

  // Parse current url and add new parameters
  private navigateToNewURL(queryParams: any, childURL?: string) {
    const url = this.router.url;
    const regEx =
      "(\\/" +
      this.page.pageInfo.path +
      ")|(\\/\\(grid[1-4]:" +
      this.page.pageInfo.path +
      "\\))";

    // Find base url for this route
    const path = url.match(regEx);
    const pathPos = path.index;
    const baseURL = url.substring(0, pathPos + path[0].length);

    const optionalParams = Object.keys(queryParams).reduce(
      (prev, current) =>
        queryParams[current] !== ""
          ? prev + ";" + current.toLowerCase() + "=" + queryParams[current]
          : prev,
      ""
    );

    // this.ignoreParamChange = true;

    let childrenURL = "";

    if (childURL) {
      if (childURL !== "none") {
        if (this.isRoot) {
          childrenURL = "/" + childURL;
        } else {
          childrenURL = `/(${this.outletKey}:${childURL})`;
        }
      }
    }
    console.log(baseURL + optionalParams + childrenURL);
    return this.router.navigateByUrl(baseURL + optionalParams + childrenURL);
  }

  // Change route to new path
  public activatePath(path: string) {
    this.navigateToNewURL(this.queryParamsRow, path);
  }

  private setActivePath() {
    const pathSegments = parseUrlPathInSegments(this.router.url);
    const index = pathSegments.lastIndexOf(this.page.pageInfo.path);
    if (pathSegments[index + 1]) {
      this.activePath = pathSegments[index + 1];
    } else {
      this.activePath = "";
    }
  }

  // Create queryParamsRow object based on given row filtered with the primary keys
  private createQueryParamsRowFromRowAndKeys(data: any, keys: Array<string>) {
    return keys.reduce((prev, curr) => {
      const result: any = Object.assign({}, prev);
      if (data) {
        result[curr] = data[curr];
      }
      return result;
    }, {});
  }

  // Create queryParams object based on given state
  private createQueryParamsFromState(state: State) {
    return {
      take: state.take,
      skip: state.skip,
    };
  }
}
