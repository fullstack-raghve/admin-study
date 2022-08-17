import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFaqComponent } from './search-faq/search-faq.component';
const routes: Routes = [
    {path:'', component: SearchFaqComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFaqRoutingModule { }
