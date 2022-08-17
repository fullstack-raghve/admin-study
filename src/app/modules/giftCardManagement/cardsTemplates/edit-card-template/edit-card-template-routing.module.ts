import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCardTemplateComponent } from './edit-card-template/edit-card-template.component';
const routes: Routes = [
  { path: '', component: EditCardTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCardTemplateRoutingModule { }
