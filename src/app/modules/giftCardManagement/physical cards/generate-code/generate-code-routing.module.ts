import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateCodeComponent } from './generate-code/generate-code.component';
const routes: Routes = [{
  path:"",
  component:GenerateCodeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateCodeRoutingModule { }
