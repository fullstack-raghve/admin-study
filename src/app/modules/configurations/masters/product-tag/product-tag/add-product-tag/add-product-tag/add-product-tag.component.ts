import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'add-product-tag',
    templateUrl: './add-product-tag.component.html',
    styleUrls: ['./add-product-tag.component.scss']
})
export class AddProductTagComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Masters',
        link: '/add-product-tag'
    }
    ];
 
    @ViewChild('createProductTagForm') createProductTagForm;
    createProductTagFormGroup: FormGroup;
    public statusValue:string = 'ONLINE';
    public toggleVal: boolean = true;
    public loading: boolean = false;
    public showError: boolean = false;
  productTagList: any;
  createdResult: any;
  isHotSellerDisplayName: string;
  isHealthyDisplayName: string;
  isLimitedTimeCategoryDisplayName: string;
  isExclusiveDisplayName: string;
  productList = [];

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, private https: HttpService) {
          this.buildCreateProductTagForm();
          this.getTag();
    }
 
  
    ngOnInit() { 
    }

    public buildCreateProductTagForm() {
      this.createProductTagFormGroup = this.fb.group({
        productTags: this.fb.array([])
      });
    }
  
    getTag() {
      this.http.getJson(environment.APIEndpoint + 'api/rpa/master/productTag/v1/get')
        .subscribe((response) => {
          this.productList = response;
          console.log(response);
         this.deliverychargesForm(this.productList);
        })
    }

    public deliverychargesForm(editData) {
      const control = <FormArray>this.createProductTagFormGroup.controls['productTags'];
      for (let i = 0; i < editData.length; i++) {
      const newForm = this.fb.group({
        tagId: [editData[i].tagId != null || editData[i].tagId != '' ? editData[i].tagId : ''],
        displayName: [editData[i].displayName != undefined || editData[i].displayName != '' || editData[i].displayName != null ? editData[i].displayName : ''],
        productName: [editData[i].productName != undefined || editData[i].productName != '' || editData[i].productName != null ? editData[i].productName : ''],
        });
        control.push(newForm);
        console.log(newForm);
      }
    }

      createProductTag(formData){
          console.log(formData);
          // if ((formData.displayName == undefined || formData.displayName == '')) {
            console.log(this.createdResult);
                this.loading = true;
                this.showError = false;
                
                  let createProductTagReq = {
                    productTags:formData.productTags,
                  }
                  let CREATE_TAG=environment.APIEndpoint+"api/rpa/master/productTag/v1/updateProductTag";
                  this.http.postJson(CREATE_TAG,createProductTagReq).subscribe((response) => {
                          this.snackBar.openFromComponent(SnackBarComponent, {
                                  duration: 10000,
                                  data: {
                                      status: "success",
                                      message: "Product Tag(s) added successfully"
                                  }
                          });
                          this.loading = false;
                          this.router.navigate(['/add-product-tag']);
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
    // }
  