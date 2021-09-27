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
    const url = this.router.url.split("?")[0]; // Only use part before query string (denoted by '?')
    const path = this.page.pageInfo.path;

    const pathPos = url.lastIndexOf(path);

    const baseURL = url.substring(0, pathPos + path.length);

    const pathQueryObject = {};
    if (Object.keys(queryParams).length !== 0) {
      pathQueryObject[path] = JSON.stringify(queryParams);
    }

    // // vvv Is this needed in this specific demo? vvv
    // let childrenURL = "";
    // if (childURL) {
    //   let hasChildAccess = true;
    // const foundChild = this.localChilds.find(
    //   (child) => child.path === childURL
    // );

    // if (foundChild) {
    //   hasChildAccess = foundChild.isEnabled;

    //   // Find other enabled child
    //   if (!hasChildAccess) {
    //     const accessableChild = this.localChilds.find(
    //       (child) => child.isEnabled
    //     );
    //     if (accessableChild) {
    //       childURL = accessableChild.path;
    //       hasChildAccess = true;
    //     } else {
    //       if (this.localChilds.length > 0) {
    //         console.warn("No access to tabs");
    //       }
    //     }
    //   }
    // }

    //   if (childURL !== "none" && hasChildAccess) {
    //     childrenURL = "/" + childURL;
    //   }
    // }
    // // ^^^ Is this needed in this specific demo? ^^^

    // Build array for router.navigate function and filter out empty strings
    const urlToNavTo = `${baseURL}/${childURL}` // was (baseURL + childrenURL)
      .split("/")
      .filter((str) => str.length > 0);

    // vvv HAckety haX vvv
    let nav = true;
    let navPreventedReason: string;
    // vv Check if the childURL is actually the query string (which is an error) vv
    if (childURL.indexOf("%") === -1) {
      // Im Westen nichts Neues
    } else {
      nav = false;
      navPreventedReason = "query string in navigation array";
    }
    // ^^ check error ^^
    const lastIndexOfUrlArray = urlToNavTo.length - 1;
    let ydetailsFoundCount = 0;
    urlToNavTo.forEach((segment) => {
      if (segment === "y-details") ydetailsFoundCount++;
    });

    if (
      // ??? why does these paths get added ???
      // !!! "y-details" seems special, other N-detail pages don't trigger this !!!
      ydetailsFoundCount > 1 ||
      urlToNavTo[lastIndexOfUrlArray] === "dummy-programs"
    ) {
      nav = false;
      navPreventedReason = "y-details is in array twice";
    }

    // navigation prevention seems to happen on a second selection in the same component
    if (!nav)
      return console.warn(`navigation prevented: ${navPreventedReason}`);
    // SubProgramADetailsDefinition.pageGrids[0].childs[0].path = "sub-sub-child-details"
    // It means there are no more routes to navigate to
    if (urlToNavTo[lastIndexOfUrlArray] === "sub-sub-child-details")
      // Happens because childs is defined but there is no corresponding component/route
      return console.info("That's all Folks!");
    // ^^^ HAckety haX ^^^

    return this.router.navigate(urlToNavTo, {
      queryParams: pathQueryObject,
    });
  }

  // Change route to new path
  public activatePath(path: string) {
    console.log('activatePath, select, whatever');
    // this.navigateToNewURL(this.queryParamsRow, path);
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
