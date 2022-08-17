import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchKioskComponent } from './search-kiosk/search-kiosk.component';
const routes: Routes = [
  { path: '', component: SearchKioskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchKioskRoutingModule { }
