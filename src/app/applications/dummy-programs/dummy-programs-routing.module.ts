import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyProgramsComponent } from './dummy-programs.component';
import { SubProgramXDetailsComponent } from './sub-program-x/sub-program-x-details/sub-program-x-details.component';
import { SubProgramXDetailsDefinition } from './sub-program-x/sub-program-x-details/sub-program-x-details.definition';
import { SubProgramYComponent } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-y-details.component';
import { SubProgramYDetailsDefinition } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-y-details.definition';
import { SubProgramAComponent } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-z-details/sub-program-a-details/sub-program-a-details.component';
import { SubProgramADetailsDefinition } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-z-details/sub-program-a-details/sub-program-a-details.definition';
import { SubProgramZComponent } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-z-details/sub-program-z-details.component';
import { SubProgramZDetailsDefinition } from './sub-program-x/sub-program-x-details/sub-program-y-details/sub-program-z-details/sub-program-z-details.definition';
import { SubProgramXComponent } from './sub-program-x/sub-program-x.component';
import { SubProgramXDefinition } from './sub-program-x/sub-program-x.definition';

const routes: Routes = [
  {
    path: '',
    component: DummyProgramsComponent,
    children: [
      {
        path: SubProgramXDefinition.pageInfo.path,
        component: SubProgramXComponent,
        children: [
          {
            path: SubProgramXDetailsDefinition.pageInfo.path,
            component: SubProgramXDetailsComponent,
            children: [
              {
                path: SubProgramYDetailsDefinition.pageInfo.path,
                component: SubProgramYComponent,
                outlet: 'grid1',
                children: [
                  {
                    path: SubProgramZDetailsDefinition.pageInfo.path,
                    component: SubProgramZComponent,
                    outlet: 'grid1',
                    children: [
                      {
                        path: SubProgramADetailsDefinition.pageInfo.path,
                        component: SubProgramAComponent,
                        outlet: 'grid1'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DummyProgramsRoutingModule {}
