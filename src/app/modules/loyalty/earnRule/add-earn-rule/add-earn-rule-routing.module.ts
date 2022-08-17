import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEarnRuleComponent } from './add-earn-rule/add-earn-rule.component';
const routes: Routes = [
    { path: '', component: AddEarnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEarnRuleRoutingModule { }
