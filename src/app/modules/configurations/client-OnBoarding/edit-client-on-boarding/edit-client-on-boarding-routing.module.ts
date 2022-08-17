import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditClientOnBoardingComponent } from './edit-client-on-boarding/edit-client-on-boarding.component';
const routes: Routes = [
    {path:'', component: EditClientOnBoardingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditClientOnBoardingRoutingModule { }
