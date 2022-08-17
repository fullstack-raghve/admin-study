import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMemberComponent } from './view-member/view-member.component';
const routes: Routes = [
    { path: '', component: ViewMemberComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMemberRoutingModule { }
