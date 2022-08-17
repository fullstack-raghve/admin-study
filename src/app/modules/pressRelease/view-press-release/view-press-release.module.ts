import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPressReleaseRoutingModule } from './view-press-release-routing.module';
import { ViewPressReleaseComponent } from './view-press-release/view-press-release.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewPressReleaseComponent],
  imports: [
    CommonModule,
    ViewPressReleaseRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewPressReleaseModule { }
