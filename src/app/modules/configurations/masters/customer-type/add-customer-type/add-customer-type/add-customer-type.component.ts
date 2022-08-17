import { Component, OnInit } from '@angular/core';
import {Validators,FormControl, FormGroup, FormBuilder, ValidatorFn, AbstractControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'add-customer-type',
  templateUrl: './add-customer-type.component.html',
  styleUrls: ['./add-customer-type.component.scss']
})
export class AddCustomerTypeComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
    }, {
        title: 'Configurations',
        link: '/search-customer-type'
    }
  ];
  checked = true;
  disabled = false;
  public customerFormGroup:FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public statusValue:string = 'ONLINE';
  public toggleVal:boolean=true;

  constructor(private fb: FormBuilder,private http:HttpService,
  private router: Router, public snackBar: MatSnackBar,)  {
      this.buildCreateConversionForm();
  }

   public buildCreateConversionForm(){
       let form = {
        customerCode : ['',Validators.required],
        customerTypeTitle :['',Validators.required],
        type:['',Validators.required]
       }
       this.customerFormGroup = this.fb.group(form);
   }
 

ngOnInit() {

}
addCustomer(formData){
    if (this.customerFormGroup.invalid == true) {
          this.showError = true;
      }else{
          let createConversionReq = {
              toCurrencyId:formData.currency2,
              conversionValue: formData.conversionValue,
              status: this.toggleVal==true ? 'ONLINE' : 'OFFLINE'
          }
          console.log("contryReq = "+createConversionReq);
          // let CREATE_CURRENCY_CONVERSION=environment.APIEndpoint+"api/rpa/master/currencyconversion/v1/create";
          // this.http.postJson(CREATE_CURRENCY_CONVERSION,createConversionReq)
          // .subscribe((response) => {
          //         console.log(response);
          //         this.snackBar.openFromComponent(SnackBarComponent, {
          //                 duration: 10000,
          //                 data: {
          //                     status: "success",
          //                     message: "Currency conversion has been added successfully"
          //                 }
          //         });
          //         this.loading = false;
          //         this.router.navigate(['/search-currency-conversion']);
          //     }
          //     ,err => {
          //             this.loading = false;
          //             console.log("error Status = "+err);
          //             if(err.error.errorType=='VALIDATION'){
          //                 this.snackBar.openFromComponent(SnackBarComponent, {
          //                         duration: 10000,
          //                         data: {
          //                             status: "failure",
          //                             message: err.error.errorDetails[0].description
          //                         }
          //                     });
          //             }else{
          //                 this.snackBar.openFromComponent(SnackBarComponent, {
          //                         duration: 10000,
          //                         data: {
          //                             status: "failure",
          //                             message: "Your request cannot be saved at this time. Please try again later"
          //                         }
          //                     });
          //             }



          //     })

      }
}
public toggleStatus(event){
    if(event.checked==true){
        this.statusValue='ONLINE';
    }else{
         this.statusValue='OFFLINE';
    }

}

}
