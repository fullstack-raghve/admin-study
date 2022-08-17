import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchKioskAlertsComponent } from './search-kiosk-alerts/search-kiosk-alerts.component';

const routes: Routes = [
  { path: '', component: SearchKioskAlertsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchKioskAlertsRoutingModule { }
