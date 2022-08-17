import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCurrencyConversionComponent } from './edit-currency-conversion/edit-currency-conversion.component';
const routes: Routes = [
    {path:'', component: EditCurrencyConversionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCurrencyConversionRoutingModule { }
