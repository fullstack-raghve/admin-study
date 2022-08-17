import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddClientOnBoardingComponent } from './add-client-on-boarding/add-client-on-boarding.component';
const routes: Routes = [
    {path:'', component:AddClientOnBoardingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddClientOnBoardingRoutingModule { }
