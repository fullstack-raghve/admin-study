import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditFeedbackComponent } from './edit-feedback/edit-feedback.component';
const routes: Routes = [
    { path: '', component: EditFeedbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditFeedbackRoutingModule { }
