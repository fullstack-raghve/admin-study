import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { notificationDialog } from '../../../../../shared/components/notification-dialog/notification.component';
import { selectStoreDialog } from '../../../../../shared/components/select-store-dialog/select-store.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

export interface StoreData {
  storeId: string;
  storeName: string;
  address: string;
}

@Component({
  selector: 'add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Categories',
    link: '/search-category'
  }
  ];
  public imgUpload = false;
  public toggleVal: boolean = true;
  public imagePath = '';
  public name = '';
  public showError = false;
  public imageErrMsg;
  public imageErr = false;
  public loading = false;
  public imageUploading = false;
  public filePathUrl =  localStorage.getItem('imgBaseUrl');
  public parentList = [];
  public brandList = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public selectedStorearray = [];
  addCategoryGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  public totalCount = 0;
  public selectedCount = 0;
  public onLoadStoreCount:any=2000;
  sortOrder;
  alignCss = [];
  public statusValue: string = 'ONLINE';
  languageDirection = [];

  public selectStoreVal = false;
  public dataStore: boolean = true;
  public storeErrorMsg;

  constructor(private fb: FormBuilder, private http: HttpService, public dialog: MatDialog,
    private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar) {
    this.buildCreateCategoryForm();
    this.getBrandList();

    let data = {
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "mall.city.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "mall.city.country.oid",
          "fieldValue": "",
        },
      ]
    }
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
      this.onLoadStoreCount =res["totalCount"];
    });
  }

  getBrandList() {
    this.http.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
      .subscribe((response) => {
        this.brandList = response;
      })
  }

  // getParentList() {
  //   let GET_ALL_PARENTS = environment.APIEndpoint + "api/rpa/productcategory/v1/get/list";
  //   this.http.getJson(GET_ALL_PARENTS)
  //     .subscribe((response) => {
  //       this.parentList = response;
  //     })
  // } 

  getCategory(brandId) {
    console.log(brandId)
    this.parentList = [];
    this.addCategoryGroup.get('sortorder').patchValue('');
    let GET_SORT = environment.APIEndpoint + "api/rpa/productcategory/v1/get/brandCategories?brandId=" +brandId  ;
    this.http.getJson(GET_SORT)
      .subscribe((response) => {
        this.parentList = response;
      });
  }

  getSortOrder(categoryId) {
    
    let GET_SORT = environment.APIEndpoint + "api/rpa/productcategory/v1/get/sortOrder?parentCategoryid=" + categoryId;
    this.http.getJson(GET_SORT)
      .subscribe((response) => {
        this.sortOrder = response["sortOrder"];
        this.addCategoryGroup.patchValue({
          sortorder: response["sortOrder"]
        });
        let sortorder = this.addCategoryGroup.get('sortorder');
        sortorder.clearValidators();
        sortorder.updateValueAndValidity();
      })
  }

  getLangauges() {
    for (let i = 0; i < this.languageList.length; i++) {
      const control = <FormArray>this.addCategoryGroup.controls['categoryFormArray'];
      let newGroup = this.fb.group({
        categoryName: ["", Validators.compose([Validators.required])],
        metaTag: ["", Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])],
        description: ["", Validators.compose([Validators.required])],
      });
      control.push(newGroup);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
    }
  }

  ngOnInit() {
    // this.getParentList();
  }

  public buildCreateCategoryForm() {
    let form = {
      categoryFormArray: this.fb.array([]),
      brandId: ["", Validators.compose([Validators.required])],
      parent: ["", Validators.compose([Validators.required])],
      sortorder: ["", Validators.compose([Validators.required, Validators.max(this.sortOrder)])],
      availableFrom: ["",Validators.compose([Validators.required])],
      availableTo: ["",Validators.compose([Validators.required])],
      storeField: [this.selectedCount, Validators.compose([Validators.min(1)])],
      // isCakeCategory: ['']
    }
    this.addCategoryGroup = this.fb.group(form);
    this.getLangauges();
  }

  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    // if (this.selectedStorearray.length <= 0) {
    //   dialogRef.componentInstance.selectAll = false;
    // } else {
    //   dialogRef.componentInstance.storeList = this.selectedStorearray;
    // }
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.totalCount = this.onLoadStoreCount;
    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.selectedCount = result.tableData.length;
        this.totalCount = result.totalCount;
        this.selectedStorearray = result.tableData.map(a => a.storeOid);
        for (let i = 0; i < result.tableData.length; i++) {
          this.selectedStorearray.push(result.tableData[i].storeOid);
          const arrrayTemp = this.selectedStorearray;
          this.selectedStorearray = Array.from(new Set(arrrayTemp));
          if (this.selectedStorearray.length) {
            this.selectStoreVal = true;
            this.dataStore = false;
            setTimeout(() => {
              this.selectStoreVal = false;
              if (this.selectStoreVal == false) {
                this.dataStore = true;
              }
            }, 2000);
          }
        }
        if (this.selectedStorearray.length != 0) {
          this.storeErrorMsg = "Please select Store";
        }
        this.addCategoryGroup.patchValue({
          storeField: this.selectedCount
        });
      }
    });
  }

  public changeValidation(availableFormTime) {
    let availableToTime = this.addCategoryGroup.get('availableTo');
    if (null != availableFormTime && availableFormTime != '') {
      availableToTime.setValidators([Validators.required]);
      availableToTime.updateValueAndValidity();
    } else {
      availableToTime.clearValidators();
      availableToTime.updateValueAndValidity();
    }
  }

  public uploadImage(event: FileList) {
    this.imageUploading = true;
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
      if (event[0].size < 1000000) {
        this.imageErr = false;
        this.imageErrMsg = "";
        this.imgUpload = true;
        this.uploadFile.upload(event.item(0), 'productCategory', 'images')
          .subscribe((response) => {
            this.imagePath = response['message'];
            this.imageUploading = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => { });
      } else {
        this.imageErr = true;
        this.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
    }

  }

  public removeImage() {
    this.imagePath = "";
  }

  alertDialog(): void {
    const dialogReference = this.dialog.open(notificationDialog, {
      width: '350px',
    });
    dialogReference.componentInstance.statusValue = this.statusValue;
    dialogReference.afterClosed().subscribe(result => {
      if (result) {
        this.toggleVal = !this.toggleVal;
      }
    });
  }


  public toggleStatus(event) {
    if (event.checked) {
      this.statusValue = 'Online';
    } else {
      this.statusValue = 'Offline';
    }
    this.alertDialog();
  }

  createCategory(formData) { 
    if(this.sortOrder < this.addCategoryGroup.get('sortorder').value){
      let sortorder = this.addCategoryGroup.get('sortorder');
      sortorder.setValidators (Validators.compose([Validators.required, Validators.max(this.sortOrder)]));
      sortorder.updateValueAndValidity();
    }else{
      let sortorder = this.addCategoryGroup.get('sortorder');
        sortorder.clearValidators();
        sortorder.updateValueAndValidity();
    }
    if (this.addCategoryGroup.invalid == true) {
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;
      let locales = [];
      // alert(this.addCategoryGroup.get('sortorder').value)
      // this.addCategoryGroup.controls['sortorder'].setValidators(
      //     Validators.compose([Validators.required, Validators.max(this.sortOrder+1)]));
      //     if()
      for (var i = 0; i < formData.categoryFormArray.length; i++) {
        if (formData.categoryFormArray[i].categoryName != "") {
          let obj = {
            languageId: this.languageList[i].languageId,
            categoryName: formData.categoryFormArray[i].categoryName,
            metaTag: formData.categoryFormArray[i].metaTag,
            description: formData.categoryFormArray[i].description
          }
          locales.push(obj);
        }
      }
      let createCategoryReq = {
        brandId: formData.brandId,
        parentProductCategoryId: formData.parent,
        sortOrder: formData.sortorder,
        availableFrom: moment(formData.availableFrom).format('HH:mm'),
        availableTo: moment(formData.availableTo).format('HH:mm'),
        imagePath: this.imagePath,
        status: this.statusValue,
        storeIds: this.selectedStorearray,
        // isCakeCategory: formData.isCakeCategory,
        categoryLocales: locales
      }
      this.http.postJson(environment.APIEndpoint + "api/rpa/productcategory/v1/create", createCategoryReq)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Category is Saved successfully"
            }
          });
          this.loading = false;
          this.router.navigate(['/search-category']);
        }
          , err => {
            this.loading = false;
            console.log("error Status = ", err);
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
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
