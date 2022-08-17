import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleTierQualificationsRoutingModule } from './role-tier-qualifications-routing.module';
import { RoleTierQualificationsComponent } from './role-tier-qualifications/role-tier-qualifications.component';
// import { EditTierQualificationsComponent } from './edit-tier-qualifications/edit-tier-qualifications.component';
// import { EditRoleTierComponent } from './edit-role-tier/edit-role-tier.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [RoleTierQualificationsComponent],
  imports: [
    CommonModule,
    RoleTierQualificationsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RoleTierQualificationsModule { }
