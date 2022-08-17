import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditBrandComponent } from './edit-brand-management/edit-brand-management.component';
const routes: Routes = [
    {path:'', component:EditBrandComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditBrandRoutingModule { }
