import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFeedbackComponent } from './search-feedback/search-feedback.component';
const routes: Routes = [
    { path: '', component: SearchFeedbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFeedbackRoutingModule { }
