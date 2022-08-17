import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCardTemplateComponent } from './add-card-template/add-card-template.component';

const routes: Routes = [
  { path:'', component:AddCardTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCardTemplateRoutingModule { }
