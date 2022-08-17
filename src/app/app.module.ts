import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './shared/components/left-Nav/app-header.module'
import { RefreshTokenInterceptor } from './services/responseInterceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EncrDecrService } from 'src/app/services/encrDecrservice';


@NgModule({
  declarations: [
    AppComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    MalihuScrollbarModule.forRoot(), 
   //  MatSelectFilterModule,
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    EncrDecrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }