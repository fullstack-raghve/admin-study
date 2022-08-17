import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchTemplateComponent } from './search-template/search-template.component';
const routes: Routes = [
    {path: '', component: SearchTemplateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchTemplateRoutingModule { }
