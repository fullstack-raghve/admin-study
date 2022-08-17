import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditEWalletComponent } from './edit-ewallet.component';

const routes: Routes = [
  { path: '', component: EditEWalletComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEWalletRoutingModule { }
