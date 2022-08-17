import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVariantsComponent } from './edit-variants/edit-variants.component';

const routes: Routes = [
  { path:'', component: EditVariantsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditVariantsRoutingModule { }
