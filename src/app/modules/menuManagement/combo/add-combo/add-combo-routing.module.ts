import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComboComponent } from './add-combo/add-combo.component';

const routes: Routes = [
  { path: '', component: AddComboComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddComboRoutingModule { }
