import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './company/components/landingPage/landing-page.component';
import { MainComponent } from './company/components/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent
      },
      {
        path: 'dummy-programs',
        loadChildren: () =>
          import('./applications/dummy-programs/dummy-programs.module').then(
            m => m.DummyProgramsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
