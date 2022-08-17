import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewGifitingComponent } from './view-gifiting/view-gifiting.component';

const routes: Routes = [{
  path: '',
  component: ViewGifitingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewGifitingRoutingModule { }
