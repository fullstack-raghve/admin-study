import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditStoreComponent } from './edit-store/edit-store.component';
const routes: Routes = [
    {path:'', component:EditStoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditStoreRoutingModule { }
