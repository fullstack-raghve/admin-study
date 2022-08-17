import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { Globals } from 'src/app/services/global';

@Component({
    selector: 'add-taxation',
    templateUrl: './addTaxation.component.html',
    styleUrls: ['./addTaxation.component.scss']
})
export class AddTaxationComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Masters',
        link: '/add-taxation'
    }
    ];
 
    @ViewChild('createTaxationForm') createTaxationForm;
    createTaxationFormGroup: FormGroup;
    public statusValue:string = 'ONLINE';
    public toggleVal: boolean = true;
    public loading: boolean = false;
    public showError: boolean = false;
  taxList: any[];
  taxType: any;
  row: any;
  taxId: any;
  taxDetails = [];

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService) {
          this.buildCreateTaxationForm();
          this.getTaxes();
    }
 
  
    ngOnInit() { 
    }

    public buildCreateTaxationForm() {
      this.createTaxationFormGroup = this.fb.group({
        taxDetails: this.fb.array([])
      });
    }

    
    public taxationForm(editData) {
      const control = <FormArray>this.createTaxationFormGroup.controls['taxDetails'];
      for (let p = 0; p < editData.length; p++) {

        const newForm = this.fb.group({
          taxDetailsOid: [editData[p].taxDetailsId],
          taxType: [editData[p].taxType],
          amount:[editData[p].amount],
          taxUnit:[editData[p].taxUnit],
        });
        control.push(newForm);
      }
    }

    public getTaxTypeArray() {
      let newForm = this.fb.group({
        taxDetailsOid: [''],
        taxType: ["", Validators.compose([Validators.required, Validators.pattern(Globals.regAlbhanumericVal)])],
        amount:[''],
          taxUnit:['']
      });
  
      console.log(newForm)
      return newForm;
    }

    public addRow(emailData) {
      const control = <FormArray>this.createTaxationFormGroup.controls.taxDetails;
        control.push(this.getTaxTypeArray());
    }

    onRemoveRow(localedata,index) {
      console.log(localedata.value.taxDetailsOid);
      if(localedata.value.taxDetailsOid == '' || localedata.value.taxDetailsOid == undefined){
        const control = <FormArray>this.createTaxationFormGroup.controls.taxDetails;
        control.removeAt(index);
      }else{
        if (confirm("Are you sure you want to delete ?")) {
          const requestBody = {
            taxOid: localedata.value.taxDetailsOid,
          }
          console.log(requestBody);
          const DELETE_TAX = environment.APIEndpoint + 'api/rpa/master/taxes/v1/delete';
          this.http.postJson(DELETE_TAX, requestBody).subscribe(
            (response) => {
              console.log(response);
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "success",
                  message: "Deleted successfully"
                }
            
              });
              const control = <FormArray>this.createTaxationFormGroup.controls.taxDetails;
              control.removeAt(index);
            },
          );
        }
      }
    }
    
      getTaxes() {
        this.http.getJson(environment.APIEndpoint + 'api/rpa/master/taxes/v1/getTaxes')
          .subscribe((response) => {
            this.taxList = response;
            console.log(response);
            this.taxationForm(this.taxList);
          })
      }

      createTaxation(formData){
          console.log(formData);
      
          if (this.taxList == undefined || this.taxList == null || this.taxList.length <= 0) {
        if (this.createTaxationFormGroup.invalid == true) {
              this.showError = true;
          }
          else {
                this.loading = true;
                this.showError = false;
                
                  let createTaxReq = {
                    taxDetails:formData.taxDetails,
                  }
                  let CREATE_TAX=environment.APIEndpoint+"api/rpa/master/taxes/v1/create";
                  this.http.postJson(CREATE_TAX,createTaxReq).subscribe((response) => {
                          this.snackBar.openFromComponent(SnackBarComponent, {
                                  duration: 10000,
                                  data: {
                                      status: "success",
                                      message: "Taxation added successfully"
                                  }
                          });
                          this.loading = false;
                          this.router.navigate(['/add-taxation']);
                      }
                      ,err => {
                              this.loading = false;
                              if(err.error.errorType=='VALIDATION'){
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: err.error.errorDetails[0].description
                                          }
                                      });
                              }else{
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: "Your request cannot be saved at this time. Please try again later"
                                          }
                                      });
                              }
                      })
              }

          }
          else{
            if (this.createTaxationFormGroup.invalid == true) {
              this.showError = true;
          }
          else {
                this.loading = true;
                this.showError = false;
  
                for (let i = 0; i < formData.taxDetails.length; i++) {
                      let locale = {
                        taxDetailsOid:formData.taxDetails[i].taxDetailsOid,
                        taxType:formData.taxDetails[i].taxType,
                        amount:formData.taxDetails[i].amount,
                        taxUnit:formData.taxDetails[i].taxUnit
                      }
                      this.taxDetails.push(locale);
                }

                  let createTaxReq = {
                    taxDetails:this.taxDetails,
                  }
                  let CREATE_TAX=environment.APIEndpoint+"api/rpa/master/taxes/v1/update";
                  this.http.postJson(CREATE_TAX,createTaxReq).subscribe((response) => {
                          this.snackBar.openFromComponent(SnackBarComponent, {
                                  duration: 10000,
                                  data: {
                                      status: "success",
                                      message: "Taxation updated successfully"
                                  }
                          });
                          this.loading = false;
                          this.router.navigate(['/add-taxation']);
                      }
                      ,err => {
                              this.loading = false;
                              if(err.error.errorType=='VALIDATION'){
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: err.error.errorDetails[0].description
                                          }
                                      });
                              }else{
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: "Your request cannot be saved at this time. Please try again later"
                                          }
                                      });
                              }
                      })
              }
          }

      }
    }