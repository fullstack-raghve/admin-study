import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewStoreComponent } from './view-store/view-store.component';
const routes: Routes = [
    {path:'', component: ViewStoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewStoreRoutingModule { }
