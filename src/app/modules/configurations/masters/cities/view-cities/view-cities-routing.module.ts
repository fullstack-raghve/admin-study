import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCitiesComponent } from './view-cities/view-cities.component';
const routes: Routes = [
    {path:'', component: ViewCitiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCitiesRoutingModule { }
