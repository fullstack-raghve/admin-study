import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCitiesComponent } from './edit-cities/edit-cities.component';
const routes: Routes = [
    {path:'', component: EditCitiesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCitiesRoutingModule { }
