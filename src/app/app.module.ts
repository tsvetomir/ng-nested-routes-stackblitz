import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { SharedModule } from "./applications/shared.module";
import { LandingPageComponent } from "./company/components/landingPage/landing-page.component";
import { MainComponent } from "./company/components/main/main.component";
import { ProgramMenuComponent } from "./company/components/programMenu/program-menu.component";
import { GeneralService } from "./company/services/general.service";
import { NavigationService } from "./company/services/navigation.service";
import { SelectedDataService } from "./company/services/selected-data.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
  ],
  declarations: [
    AppComponent,
    MainComponent,
    LandingPageComponent,
    ProgramMenuComponent,
  ],
  bootstrap: [AppComponent],
  providers: [NavigationService, GeneralService, SelectedDataService],
})
export class AppModule {}
