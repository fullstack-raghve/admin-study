import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewCorporateAccountRoutingModule } from './view-corporate-account-routing.module';
import { ViewCorporateAccountComponent } from './view-corporate-account/view-corporate-account.component';

@NgModule({
  declarations: [ViewCorporateAccountComponent],
  imports: [
    CommonModule,
    ViewCorporateAccountRoutingModule,
    SharedModule,
    
  ]
})
export class ViewCorporateAccountModule { }
