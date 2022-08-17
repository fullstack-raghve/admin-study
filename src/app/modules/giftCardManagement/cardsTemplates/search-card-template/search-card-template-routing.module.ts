import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCardTemplateComponent } from './search-card-template/search-card-template.component';
const routes: Routes = [
  { path: '', component: SearchCardTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCardTemplateRoutingModule { }
