import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCorporateAccountComponent } from './view-corporate-account/view-corporate-account.component';

const routes: Routes = [
  {path:'', component:ViewCorporateAccountComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCorporateAccountRoutingModule { }
