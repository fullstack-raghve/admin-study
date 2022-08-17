import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {forgot_passwordComponent} from './forgot-password/forgot-password.component'

@NgModule({
  declarations: [LoginComponent,
    forgot_passwordComponent],
  imports: [
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],

  entryComponents: [
    forgot_passwordComponent
  ],
})
export class LoginModule { }
