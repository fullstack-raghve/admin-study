import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBurnRuleComponent } from './edit-burn-rule/edit-burn-rule.component';
const routes: Routes = [
    { path: '', component: EditBurnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBurnRuleRoutingModule { }
