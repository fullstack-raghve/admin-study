import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewClientOnBoardingComponent } from './view-client-on-boarding/view-client-on-boarding.component';
const routes: Routes = [
    {path:'', component: ViewClientOnBoardingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewClientOnBoardingRoutingModule { }
