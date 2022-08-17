import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditEarnRuleComponent } from './edit-earn-rule/edit-earn-rule.component';
const routes: Routes = [
    { path: '', component: EditEarnRuleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEarnRuleRoutingModule { }
