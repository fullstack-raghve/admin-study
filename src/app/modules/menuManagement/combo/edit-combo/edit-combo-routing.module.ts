import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComboComponent } from './edit-combo/edit-combo.component';

const routes: Routes = [
  { path: '', component: EditComboComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditComboRoutingModule { }
