import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFaqComponent } from './add-faq/add-faq.component';
const routes: Routes = [
    { path: '', component: AddFaqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFaqRoutingModule { }
