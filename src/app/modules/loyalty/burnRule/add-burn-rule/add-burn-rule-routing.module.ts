import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBurnRuleComponent } from './add-burn-rule/add-burn-rule.component';
const routes: Routes = [
    { path: '', component: AddBurnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddBurnRuleRoutingModule { }
