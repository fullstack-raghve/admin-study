import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchUserComponent } from './search-user/search-user.component';

const routes: Routes = [
  { path: '', component: SearchUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchUserRoutingModule { }
