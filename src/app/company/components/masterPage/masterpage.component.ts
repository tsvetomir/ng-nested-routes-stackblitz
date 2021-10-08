import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { State } from "@progress/kendo-data-query";
import { products } from "../../../products";
import { FilterAction } from "../../enums/filter-action.enum";
import { GridAction } from "../../enums/grid-action.enum";
import { FilterRequest } from "../../interfaces/filter";
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

  public localChilds: Array<Childpage>;
  public localPageData: PageData;
  public localPageGrid: PageGrid;
  public activePath = "";
  public queryParamsState: any = {};

  private queryParamsRow: any = {};
  private subscribers: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

    this.route.queryParams.subscribe((queryParams) => {
      // No filters present in this case
      if (queryParams[this.page.pageInfo.path] === undefined) {
        this.localPageGrid.defaultPagerSize = 15;
        if (!this.localPageData.state.take) {
          this.localPageData.state.take = this.localPageGrid.defaultPagerSize;
        }

        if (!this.localPageData.state.skip) {
          this.localPageData.state.skip = 0;
        }
        return;
      }

      const parsedParams = JSON.parse(queryParams[this.page.pageInfo.path]);
      this.localPageData.state.skip = parsedParams.skip;
      this.localPageData.state.take = parsedParams.take;
      this.localPageData.state.filter.filters = parsedParams.filters;
    });

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
          this.setActivePath();
        }
      }
    );
  }

  public filterAction(filterRequest: FilterRequest) {
    switch (filterRequest.filterAction) {
      case FilterAction.Filter: {
        this.filter(filterRequest);
        break;
      }
      case FilterAction.Clear: {
        this.clearFilter();
        break;
      }
      default: {
        break;
      }
    }
  }

  private filter(filterRequest: FilterRequest) {
    if (filterRequest.filters.length === 0) return;

    this.localPageData.dataItems.data = [];
    this.localPageData.dataItems.total = 0;

    for (let i = 0; i < products.length; i++) {
      if (products[i].ProductName === filterRequest.filters[0].value) {
        this.localPageData.dataItems.data.push(products[i]);
        this.localPageData.dataItems.total = products.length;
      }
    }
    this.localPageData.state = filterRequest.state;
  }

  private clearFilter() {
    this.localPageData.dataItems.data = products;
    this.localPageData.dataItems.total = products.length;
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
      childPath = this.activePath ? this.activePath : this.localChilds[0].path;
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
    const url = this.router.url.split("?")[0]; // Only use part before query string (denoted by '?')
    const path = this.page.pageInfo.path;

    const pathPos = url.lastIndexOf(path);

    const baseURL = url.substring(0, pathPos + path.length);

    const pathQueryObject = {};
    if (Object.keys(queryParams).length !== 0) {
      pathQueryObject[path] = JSON.stringify(queryParams);
    }

    let nav = true;
    if (childURL === "dummy-programs") {
      nav = false;
      console.warn(childURL);
    }

    // Build array for router.navigate function and filter out empty strings
    let navUrl = `${baseURL}/${childURL}`.split("?")[0];
    const pathIndexInUrl = navUrl.indexOf(childURL);
    if (!navUrl.endsWith("/")) navUrl += "/";
    if (pathIndexInUrl === -1) {
      navUrl += `${childURL}`;
    } else {
      navUrl = navUrl.slice(0, pathIndexInUrl + childURL.length);
    }

    const navUrlArray = navUrl.split("/").filter((str) => str.length > 0);
    if (nav === false) return console.error("navigation error");
    return this.router.navigate(navUrlArray, {
      queryParams: pathQueryObject,
      queryParamsHandling: "merge"
    });
  }

  // Change route to new path
  public activatePath(path: string) {
    this.navigateToNewURL(this.queryParamsRow, path);
  }

  private setActivePath() {
    const pathSegments = this.router.url
      .split("/")
      .filter((segment) => segment);
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
    const queryParams = {
      take: state.take,
      skip: state.skip,
    };
    if (state.filter.filters.length > 0) {
      queryParams["filters"] = state.filter.filters;
    }
    return queryParams;
  }
}
