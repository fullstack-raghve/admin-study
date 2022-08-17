import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComboComponent } from './search-combo/search-combo.component';

const routes: Routes = [
  { path: '', component: SearchComboComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchComboRoutingModule { }
