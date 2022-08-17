import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMallsComponent } from './view-malls/view-malls.component';
const routes: Routes = [
    {path:'', component: ViewMallsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMallsRoutingModule { }
