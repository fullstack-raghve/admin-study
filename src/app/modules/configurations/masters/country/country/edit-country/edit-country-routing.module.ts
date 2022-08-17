import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCountryComponent } from './edit-country/edit-country.component';

const routes: Routes = [
{ path: '' , component: EditCountryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCountryRoutingModule { }
