import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectedDataService {
  selectedData$ = new BehaviorSubject<any>(null);

  selectedData(data: any) {
    this.selectedData$.next(data);
  }
}
