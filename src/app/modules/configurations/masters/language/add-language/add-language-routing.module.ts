import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLanguageComponent } from './add-language/add-language.component';
const routes: Routes = [
    { path:'', component: AddLanguageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddLanguageRoutingModule { }
