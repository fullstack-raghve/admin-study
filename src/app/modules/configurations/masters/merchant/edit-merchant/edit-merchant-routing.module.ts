import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMerchantComponent } from './edit-merchant/edit-merchant.component';

const routes: Routes = [
  {path:'',component:EditMerchantComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMerchantRoutingModule { }
