import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTaxationComponent } from './add-taxation/addTaxation.component';

const routes: Routes = [
  { path: '', component: AddTaxationComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddTaxationRoutingModule { }
