import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchLanguageComponent } from './search-language/search-language.component';
const routes: Routes = [
    { path:'', component: SearchLanguageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchLanguageRoutingModule { }
