import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComboComponent } from './view-combo/view-combo.component';

const routes: Routes = [
  { path: '', component: ViewComboComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewComboRoutingModule { }
