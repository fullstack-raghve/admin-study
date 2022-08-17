import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPartnerComponent } from './search-partner/search-partner.component';
const routes: Routes = [
    { path: '', component: SearchPartnerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchPartnerRoutingModule { }
