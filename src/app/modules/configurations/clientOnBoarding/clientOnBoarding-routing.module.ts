import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { clientOnBoardingComponent } from './clientOnBoarding/clientOnBoarding.component';


const routes: Routes = [
  { path: '', component: clientOnBoardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class clientOnBoardingRoutingModule { }
