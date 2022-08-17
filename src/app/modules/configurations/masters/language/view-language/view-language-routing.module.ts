import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewLanguageComponent } from './view-language/view-language.component';
const routes: Routes = [
    {path:'', component: ViewLanguageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewLanguageRoutingModule { }
