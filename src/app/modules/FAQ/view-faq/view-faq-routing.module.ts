import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewFaqComponent } from './view-faq/view-faq.component';
const routes: Routes = [
    { path:'', component: ViewFaqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewFaqRoutingModule { }
