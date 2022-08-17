import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewNpsDesignComponent } from './view-nps-design/view-nps-design.component';

const routes: Routes = [{
  path: '',
  component: ViewNpsDesignComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNpsDesignRoutingModule { }
