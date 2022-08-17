import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditKioskComponent } from './edit-kiosk/edit-kiosk.component';

const routes: Routes = [
  { path: '', component: EditKioskComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditKioskRoutingModule { }
