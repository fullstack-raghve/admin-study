import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditLocationComponent } from './edit-location/edit-location.component';

const routes: Routes = [
  { path: '', component: EditLocationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditLocationRoutingModule { }
