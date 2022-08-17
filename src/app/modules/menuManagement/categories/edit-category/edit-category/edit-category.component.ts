import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { notificationDialog } from '../../../../../shared/components/notification-dialog/notification.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

@Component({
  selector: 'edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Categories',
    link: '/search-category'
  }
  ];
  public imgUpload = false;
  public buildFlag = false;
  public toggleVal;
  public imagePath = '';
  public name = '';
  public showError = false;
  public imageErrMsg;
  public imageErr = false;
  public loading = false;
  public imageUploading = false;
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public id;
  public viewData;
  public checked;
  editCategoryGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  public totalCount;
  public selectedCount;
  public selectedStorearray = [];
  public parentList = [];
  public brandList = [];
  public sortOrder = 0;
  alignCss = [];
  public onLoadStoreCount:any=2000;
  statusValue = "";

  public selectStoreVal = false;
  public dataStore: boolean = true;
  public storeErrorMsg;
  languageDirection = [];

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public dialog: MatDialog,
    public snackBar: MatSnackBar, private uploadFile: UploadFile) {
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
        this.onLoadStoreCount =res["totalCount"];
      });
  }

  ngOnInit() {
    this.getBrandList();
    // this.getParentList();
    this.getViewData();
  }

  getBrandList() {
    this.http.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
      .subscribe((response) => {
        this.brandList = response;
      })
  }

  // getParentList() {
  //   this.http.getJson(environment.APIEndpoint + "api/rpa/productcategory/v1/get/list")
  //     .subscribe((response) => {
  //       this.parentList = response;
  //     })
  // }
  getCategory(brandId) {
    console.log(brandId)
    this.parentList = [];
    this.editCategoryGroup.get('sortorder').patchValue('');
    let GET_SORT = environment.APIEndpoint + "api/rpa/productcategory/v1/get/brandCategories?brandId=" +brandId  ;
    this.http.getJson(GET_SORT)
      .subscribe((response) => {
        this.parentList = response;
      });
  }
  getSortOrder(categoryId) {
    let sortorder = this.editCategoryGroup.get('sortorder');
        sortorder.clearValidators();
        sortorder.updateValueAndValidity();
    this.http.getJson(environment.APIEndpoint + "api/rpa/productcategory/v1/get/sortOrder?parentCategoryid=" + categoryId)
      .subscribe((response) => {
        this.sortOrder = response["sortOrder"];
        this.editCategoryGroup.patchValue({
          sortorder: this.sortOrder
        });
        // this.editCategoryGroup.controls['sortorder'].setValidators(
        //   Validators.compose([Validators.required, Validators.pattern("^[0-9]*$"),
        //   Validators.max(this.sortOrder)]));
      })
  }

  getViewData() {
    this.id = this.router.url.split('edit-category/')[1];
    let data = {
      "categoryId": parseFloat(this.id)
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/productcategory/v1/view", data).subscribe(res => {
      this.viewData = res;
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.imgUpload = true;
      this.sortOrder = this.viewData.sortOrder;
      this.selectedCount = this.viewData.selectedStoreCount;
      this.totalCount = this.viewData.totalStoreCount;
      this.buildForm(this.viewData);
      for (let prod of this.viewData["categoryLocales"]) {
        this.alignCss.push(prod.direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(prod.direction == 'RTL' ? 'direction' : '');
      }

    })
  }

  public toggleStatus(event) {
    if (event.checked) {
      this.statusValue = 'Online';
    } else {
      this.statusValue = 'Offline';
    }
    this.alertDialog();
  }


  // public changeValidation(availableFormTime) {
  //   let availableToTime = this.editCategoryGroup.get('availableTo');
  //   if (null != availableFormTime && availableFormTime != '') {
  //     availableToTime.setValidators([Validators.required]);
  //     availableToTime.updateValueAndValidity();
  //   } else {
  //     availableToTime.clearValidators();
  //     availableToTime.updateValueAndValidity();
  //   }
  // }

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

  public buildForm(viewData) {
    if (viewData.length == 0) {
      let form = {
        categoryFormArray: this.fb.array([])
      }
      this.editCategoryGroup = this.fb.group(form);
    } else {
      this.buildFlag = true;
      let availableFromTime;
      if (viewData.availableFrom != null) {
        availableFromTime = new Date();
        let e = viewData.availableFrom.split(":");
        availableFromTime.setHours(e[0]);
        availableFromTime.setMinutes(e[1]);
      }
      let availableToTime;
      if (viewData.availableTo != null) {
        availableToTime = new Date();
        let t = viewData.availableTo.split(":");
        availableToTime.setHours(t[0]);
        availableToTime.setMinutes(t[1]);
      }

      this.editCategoryGroup = this.fb.group({
        categoryFormArray: this.fb.array([]),
        brandId: [viewData.brand.brandId, Validators.compose([Validators.required])],
        parent: [viewData.parentProductCategoryId.toString(), Validators.compose([Validators.required])],
        sortorder: [viewData.sortOrder, Validators.compose([Validators.required, Validators.max(this.sortOrder)])],
        availableFrom: [availableFromTime,Validators.compose([Validators.required])],
        availableTo: [availableToTime,Validators.compose([Validators.required])],
        // isCakeCategory: [viewData.isCakeCategory]
      })
      
      for (let ln of viewData.categoryLocales) {
        const control = <FormArray>this.editCategoryGroup.controls['categoryFormArray'];
        let newGroup = this.fb.group({
          categoryName: [ln.categoryName, Validators.compose([Validators.required])],
          metaTag: [ln.metaTag, Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])],
          description: [ln.description, Validators.compose([Validators.required])],
        });
        control.push(newGroup);
      }

      if (viewData.stores.length != 0) {
        for (let i of viewData.stores) {
          this.selectedStorearray.push(i.storeOid);
        }
      }
      this.imagePath = viewData.imagePath;
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
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
      }
    });
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

  createCategory(formData) {
    if(this.sortOrder < this.editCategoryGroup.get('sortorder').value){
      let sortorder = this.editCategoryGroup.get('sortorder');
      sortorder.setValidators (Validators.compose([Validators.required, Validators.max(this.sortOrder)]));
      sortorder.updateValueAndValidity();
    }else{
      let sortorder = this.editCategoryGroup.get('sortorder');
        sortorder.clearValidators();
        sortorder.updateValueAndValidity();
    }
    if (this.editCategoryGroup.invalid == true) {
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;
      let locales = [];
      for (var i = 0; i < formData.categoryFormArray.length; i++) {
        if (formData.categoryFormArray[i].content != "") {
          let obj = {
            languageId: this.viewData.categoryLocales[i].languageId,
            categoryName: formData.categoryFormArray[i].categoryName,
            metaTag: formData.categoryFormArray[i].metaTag,
            description: formData.categoryFormArray[i].description
          }
          locales.push(obj);
        }
      }
      let createCategoryReq = {
        categoryId: this.id,
        brandId: formData.brandId,
        parentProductCategoryId: formData.parent,
        sortOrder: formData.sortorder,
        availableFrom: moment(formData.availableFrom).format('HH:mm'),
        availableTo: moment(formData.availableTo).format('HH:mm'),
        imagePath: this.imagePath,
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        // isCakeCategory: formData.isCakeCategory,
        storeIds: this.selectedStorearray,
        categoryLocales: locales
      }
      this.http.postJson(environment.APIEndpoint + "api/rpa/productcategory/v1/update", createCategoryReq)
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
