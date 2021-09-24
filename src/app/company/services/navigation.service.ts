import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { parseUrlPathInSegments } from '../classes/url-path-parser';
import { GeneralService } from './general.service';

@Injectable()
export class NavigationService {
  showSelectProgramFirstText$ = new BehaviorSubject<boolean>(false);
  private fullPathArray: Array<{
    path: string;
    title: string;
    isLicensed?: boolean;
    hasUserRights?: boolean;
  }> = [];
  private subscribers: any = {};

  constructor(
    public title: Title,
    public router: Router,
    private generalService: GeneralService
  ) {
    this.subscribers.eventsSubscription = this.router.events.subscribe(
      (routerEvent: RouterEvent) => {
        this.handleNavigationEvent(routerEvent);
      }
    );
  }

  private handleNavigationEvent(routerEvent: RouterEvent) {
    // Update browser title
    if (routerEvent instanceof NavigationEnd) {
      if (routerEvent.url !== '/login') {
        this.createTitleBreadcrumb();
      }
    }
  }

  private async createTitleBreadcrumb(childPath?: string, newTitle?: string) {
    // Parse current url to array of full paths
    const pathArray: Array<string> = [];
    const pathSegments = parseUrlPathInSegments(this.router.url);

    if (pathSegments.length === 1) {
      this.showSelectProgramFirstTextToggle(true);
      this.generalService.sidebarHasContentToggle(true);
    } else {
      this.showSelectProgramFirstTextToggle(false);
      this.generalService.sidebarHasContentToggle(false);
    }

    if (childPath && newTitle) {
      let copy = [...pathSegments];
      const index = copy.lastIndexOf(childPath);
      if (index > -1) {
        copy = copy.slice(0, index + 1);
      }
      this.fullPathArray.push({
        path: '/' + copy.join('/'),
        title: newTitle
      });
    }

    pathSegments.forEach((path, index) => {
      const prevPath = pathArray[index - 1];
      const newPath = prevPath ? prevPath + '/' + path : '/' + path;
      pathArray.push(newPath);
    });

    // Map full paths to concatenated string of path titles
    const reversedBreadcrumb = pathArray
      .map(fullPath => this.getTitleForFullPath(fullPath))
      .reduce((prev, curr) => {
        if (curr) {
          return curr + ' - ' + prev;
        } else {
          return prev;
        }
      }, 'local:ProWeb');

    // Set browser tab title
    this.title.setTitle(reversedBreadcrumb);
  }

  // Return default title or found title
  getTitleForFullPath(fullPath: string): string {
    const foundObject = this.fullPathArray.find(
      object => object.path === fullPath
    );
    return foundObject ? foundObject.title : null;
  }

  showSelectProgramFirstTextToggle(show: boolean) {
    this.showSelectProgramFirstText$.next(show);
  }
}
