import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'sp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  public progSelected: boolean;
  public sidebarHasContent: boolean;

  private subscribers: any = {};

  constructor(
    private navigationService: NavigationService,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.subscribers.programSelectedSubscription = this.navigationService.showSelectProgramFirstText$.subscribe(
      toggle => {
        this.progSelected = toggle;
      }
    );

    this.subscribers.generalSerivceSubscription = this.generalService.sidebarHasContent$.subscribe(
      toggle => {
        this.sidebarHasContent = toggle;
      }
    );
  }

  ngOnDestroy() {
    for (const subscriberKey of Object.keys(this.subscribers)) {
      const subscriber = this.subscribers[subscriberKey];
      if (subscriber instanceof Subscription) {
        subscriber.unsubscribe();
      }
    }
  }
}
