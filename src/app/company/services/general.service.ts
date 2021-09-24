import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GeneralService {
  sidebarHasContent$ = new BehaviorSubject<boolean>(false);

  sidebarHasContentToggle(toggle: boolean) {
    this.sidebarHasContent$.next(toggle);
  }
}
