import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBurnRuleComponent } from './view-burn-rule/view-burn-rule.component';
const routes: Routes = [
    { path: '', component: ViewBurnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBurnRuleRoutingModule { }
