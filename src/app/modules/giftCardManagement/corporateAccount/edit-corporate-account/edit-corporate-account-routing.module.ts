import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCorporateAccountComponent } from './edit-corporate-account/edit-corporate-account.component';

const routes: Routes = [
  { path:'', component:EditCorporateAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCorporateAccountRoutingModule { }
