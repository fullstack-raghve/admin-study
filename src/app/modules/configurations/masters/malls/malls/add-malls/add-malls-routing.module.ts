import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMallsComponent } from './add-malls/add-malls.component';
const routes: Routes = [
    {path:'', component: AddMallsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMallsRoutingModule { }
