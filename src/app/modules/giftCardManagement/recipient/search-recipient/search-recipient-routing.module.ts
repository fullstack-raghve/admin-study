import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchRecipientComponent } from './search-recipient/search-recipient.component';
const routes: Routes = [{
  path:"",
  component:SearchRecipientComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRecipientRoutingModule { }
