import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditLanguageComponent } from './edit-language/edit-language.component';
const routes: Routes = [
    { path:'', component: EditLanguageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditLanguageRoutingModule { }
