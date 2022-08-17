import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NpsDesignComponent } from './nps-design/nps-design.component';

const routes: Routes = [{
  path: '',
  component: NpsDesignComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NpsDesignRoutingModule { }
