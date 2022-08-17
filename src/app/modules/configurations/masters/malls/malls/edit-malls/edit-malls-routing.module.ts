import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMallsComponent } from './edit-malls/edit-malls.component';
const routes: Routes = [
    {path:'', component: EditMallsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMallsRoutingModule { }
