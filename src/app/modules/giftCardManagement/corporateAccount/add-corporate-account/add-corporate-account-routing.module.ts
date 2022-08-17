import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCorporateAccountComponent } from './add-corporate-account/add-corporate-account.component';

const routes: Routes = [
  { path: '', component: AddCorporateAccountComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCorporateAccountRoutingModule { }
