import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'edit-variants',
  templateUrl: './edit-variants.component.html',
  styleUrls: ['./edit-variants.component.scss']
})
export class EditVariantsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
}, {
    title: 'Variants',
    link: '/edit-variants'
}
];
 
  @ViewChild(MatTable) table: MatTable<any>;
  variantFormGroup :FormGroup;
  public statusValue: string = 'ONLINE';
  public toggleVal = true;
  public variantOid: number;
  public variantTypeOids: any = [];
  public variantData: any = [];
  public alignCss=[];
  public buildFlag: boolean = false;
  public loading: boolean = false;
  public variant_locale:any=[];
  public variant_locales:any=[];
  public variant_types:any=[];
  public showError: boolean = false;
  public errorMsg:any=[];
  languageDirection = [];

  public languageList =JSON.parse(localStorage.getItem("languageList"));
  displayedColumns = [];
  dataSource = data;

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpService, private fb: FormBuilder,
    private router: Router, public snackBar: MatSnackBar) {
    this.activatedRoute.params.subscribe((params) => {
        this.variantOid = params.id;
        this.languageList.forEach(lang => {
          this.displayedColumns.push(lang.languageName);
        });
        this.displayedColumns.push('delete');
    });
  }

  ngOnInit() {
    this.getVariantById();
  }

  public getVariantById() {
    let GET_VARIANT_BY_ID = environment.APIEndpoint + "api/rpa/menu/variant/v1/view";
    let request = {
      variantOid: this.variantOid
    }
    this.http.postJson(GET_VARIANT_BY_ID, request)
        .subscribe((response) => {
            console.log(response);
            this.variantData = response;
            this.buildEditVariantForm(this.variantData);
            this.toggleVal=(this.variantData.status=='ONLINE'?true:false);
            this.dataSource=[];
            for(let varType of this.variantData.variantTypes){
              this.variantTypeOids.push(varType.variantTypeOid);
              this.dataSource.push(varType.variantTypeLocales);
            }
        }
        , err => {
            if (err.error == "invalid_token") {
                alert("Invalid Token");
            }
            console.log("error Status = " + err.status);
        })
      }

      public variantTypeLocaleForm(){
        console.log("size = "+this.languageList.length);
        const control = <FormArray>this.variantFormGroup.controls['variantTypeLocale'];
        for(let ln of this.languageList){
            let arr= this.fb.group({
              variantType: ['',],
            });
            control.push(arr);
        this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
        }
    }

      public buildEditVariantForm(editData){
         if (editData == undefined) {
             let form = {
             variantTypeLocale:this.fb.array([]),
               variantName : ["", Validators.compose([Validators.required])],
           }
           this.variantFormGroup=this.fb.group(form);
         }
         else {
            this.buildFlag = true;
            this.statusValue = editData.status ;

            this.variantFormGroup = this.fb.group({
                variantTypeLocale:this.fb.array([]),
                variantName : [editData.variantName, Validators.compose([Validators.required])],
            })
            this.variantTypeLocaleForm();
            this.toggleVal=editData.status == 'ONLINE' ? true : false;
            this.variantFormGroup.updateValueAndValidity();
        }
    }


    // public addVariantType(){
    //   let controll=this.variantFormGroup.get('variantTypeLocale') as FormArray;
    //   let array=[];
    //   for(var i=0;i< this.languageList.length;i++){
    //     array.push({
    //       "languageOid":this.languageList[i].languageId,
    //       "variantType":controll.at(i).get('variantType').value
    //     })
    //   }
    //   this.dataSource.push(array);
    //   this.table.renderRows();
    //   console.log(this.dataSource);
    // }


  //   public showVariantError=[];
  // public addVariantType(){
  //   let controll=this.variantFormGroup.get('variantTypeLocale') as FormArray;
  //   let array=[];
  //   let validArray=[];
  //   for(var i=0;i< this.languageList.length;i++){
  //     let val =controll.at(i).get('variantType');
  //     if(null == val.value || val.value ==''){
  //       val.setValidators([Validators.required]);
  //       val.updateValueAndValidity();
  //       this.showVariantError[i]=true; 
  //       this.errorMsg = "Please enter a value";
  //      }else{
  //       this.showVariantError[i] = false;
  //       val.clearValidators();
  //       val.updateValueAndValidity();
  //       }
  //       if(this.showVariantError[i]==false){
  //         array.push({
  //           "languageOid":this.languageList[i].languageId,
  //           "variantType":controll.at(i).get('variantType').value
  //         })
  //         if(array.length == this.languageList.length){
  //           this.dataSource.push(array);
  //           this.table.renderRows();
  //           console.log(this.dataSource);
  //         }
  //       }
  //       val.setValue(""); 
  //   }
  // }

  public showVariantError = [];
  public addVariantType() {
    let controll = this.variantFormGroup.get('variantTypeLocale') as FormArray;
    let array = [];
    for (var i = 0; i < this.languageList.length; i++) {
      this.showVariantError[i] = false;
      let variantType = controll.at(i).get('variantType');
      let languageOid = this.languageList[i].languageId;

      if (null == variantType.value || variantType.value == '') {
        this.showVariantError[i] = true;
        this.errorMsg[i] = "Please enter a value";
      } else {
        for (var j = 0; j < this.dataSource.length; j++) {
          for (var k = 0; k < this.dataSource[j].length; k++) {
            let data = this.dataSource[j][k];
            if (data.languageOid == languageOid && data.variantType == variantType.value) {
              this.showVariantError[i] = true;
              this.errorMsg[i] = "Entered variant type is duplicate";
            }
          }
        }
      }
      if (this.showVariantError[i] == false) {
        array.push({
          "languageOid": this.languageList[i].languageId,
          "variantType": controll.at(i).get('variantType').value
        })
        variantType.setValue("");
      }
    }
    if (array.length == this.languageList.length) {
      this.dataSource.push(array);
      this.table.renderRows();
    }
  }

    updateVariant(formData){
      this.variant_locale=[];
      this.variant_types=[];
      this.variant_locales=[];
      if (this.variantFormGroup.invalid) {
            this.showError = true;
        }
        else {
            this.loading = true;
            this.showError = false; 

            for (let i = 0; i < this.dataSource.length; i++) {
              this.variant_types.push({
              variantTypeOid:this.variantTypeOids[i],
              variantTypeLocales:this.dataSource[i]
            })
            }
              
            let editVariantRequest = {
              variantOid:this.variantOid,
              variantName:formData.variantName,
              variantTypes: this.variant_types,
              status:this.statusValue,
            }
             
            let EDIT_VARIANTS=environment.APIEndpoint+"api/rpa/menu/variant/v1/update";
            this.http.postJson(EDIT_VARIANTS,editVariantRequest)
            .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "success",
                                message: "Variant updated successfully"
                            }
                    });
                    this.loading = false;
                    this.router.navigate(['/search-variants']);
                }
                ,(err) => {
                        this.loading = false;
                        console.log("error Status = "+err);
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

  delete(row: any): void {
    const index = this.dataSource.indexOf(row, 0);
    if (index > -1) {
      this.dataSource.splice(index, 1);
    }
    this.table.renderRows();
  }

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
}
const data = []
