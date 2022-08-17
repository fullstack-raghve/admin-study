import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TierQualificationComponent } from './tier-qualification/tier-qualification.component';
const routes: Routes = [
    { path: '', component: TierQualificationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TierQualificationRoutingModule { }
