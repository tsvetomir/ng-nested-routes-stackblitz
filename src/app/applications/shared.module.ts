import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';
import { MasterPageComponent } from '../company/components/masterPage/masterpage.component';
import { DetailPageComponent } from '../company/components/detailPage/detail-page.component';
import { RouterModule } from '@angular/router';
import { PageChildsWrapperComponent } from '../company/components/page-child-wrapper/page-child-wrapper.component';
import { GridComponent } from '../company/components/grid/grid.component';
import { FormComponent } from '../company/components/form/form.component';

@NgModule({
  imports: [CommonModule, GridModule, RouterModule],
  declarations: [
    MasterPageComponent,
    DetailPageComponent,
    GridComponent,
    PageChildsWrapperComponent,
    FormComponent
  ],
  providers: [],
  exports: [
    MasterPageComponent,
    DetailPageComponent,
    GridComponent,
    PageChildsWrapperComponent,
    FormComponent,
    GridModule,
    RouterModule
  ]
})
export class SharedModule {}
