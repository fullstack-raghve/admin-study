import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEarnRuleComponent } from './view-earn-rule/view-earn-rule.component';
const routes: Routes = [
    { path: '', component: ViewEarnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEarnRuleRoutingModule { }
