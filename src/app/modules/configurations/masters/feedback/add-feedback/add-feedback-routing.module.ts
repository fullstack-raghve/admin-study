import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFeedbackComponent } from './add-feedback/add-feedback.component';
const routes: Routes = [
    { path: '', component: AddFeedbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFeedbackRoutingModule { }
