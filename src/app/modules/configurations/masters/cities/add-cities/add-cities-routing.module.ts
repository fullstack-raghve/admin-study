import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCitiesComponent } from './add-cities/add-cities.component';
const routes: Routes = [
    {path:'', component: AddCitiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCitiesRoutingModule { }
