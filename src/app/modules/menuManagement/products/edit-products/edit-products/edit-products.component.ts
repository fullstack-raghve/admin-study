import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar, MatRadioChange } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { notificationDialog } from '../../../../../shared/components/notification-dialog/notification.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DieatryImageDialog } from '../../dieatry-image-dialog/dieatry-image-dialog.component';
import { AlergionImageDialog } from '../../alergion-image-dialog/alergion-image-dialog.component';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { productOnlineOfflineDialog } from 'src/app/shared/components/product-online-offline-dialogue/product-online-offline-dialogue.component';

@Component({
  selector: 'edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss']
})

export class EditProductsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Products',
    link: '/search-products'
  }
  ];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public imgUpload = false;
  public imgUploadDieatry = false;
  public imgUploadAlergion = false;
  public toggleVal;
  public checked;
  public imagePath = [];
  public imagePathDieatry = [];
  public imagePathAlergion = [];
  public showError = false;
  public imageErrMsg = "";
  public imageErr = false;
  public loading = false;
  public imageUploading = false;
  public statusValue: string = 'Online';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public parentList = [];
  public brandList = [];
  public selectedStorearray = [];
  public buildFlag = false;
  editProductGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  public totalCount = 0;
  public selectedCount = 0;
  sortOrder = 0;
  defaultId = undefined;
  addons = [];
  columns = [];
  columnArr = [];
  columnHeadArr = [];
  count = 0;
  id;
  viewData;
  parentIdsObj = [];
  public alignCss = [];
  public rightPanel = [];
  public minCount = 0;
  errorMsg = "Please select value";
  priceLabel = "Same Price";
  price;
  module = '';
  disabledCategory: boolean = true;
  productTagList: any[];
  exclusiveProducts: any;
  limitedTimeProducts: any;
  healthyProducts: any;
  hotSellerProducts: any;


  selectedCategoryOptions: any[];
  categoriesList: any[];
  // @Input('parentId') parentId: number = 0;

  addOnarray = [
    {
      name: 'Curd',
      value: 'curd',
      checked: false
    },
    {
      name: 'Butter',
      value: 'butter',
      checked: false
    },
    {
      name: 'Ketchup',
      value: 'ketchup',
      checked: false
    },
    {
      name: 'Seasoning',
      value: 'seasoning',
      checked: false
    },
    {
      name: 'Cheese',
      value: 'cheese',
      checked: false
    },
    {
      name: 'Mayonnaise',
      value: 'mayonnaise',
      checked: false
    },
    {
      name: 'Pickle',
      value: 'pickle',
      checked: false
    },

  ]
  brandId: any;
  categoryIds: any;
  selectedCategoryOids = [];
  languageDirection = [];
  public pageLoader: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpService, public dialog: MatDialog,
    private uploadFile: UploadFile, public snackBar: MatSnackBar, private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
      this.module = params.module;
      console.log(this.module);
    });
    this.getBrandList();
    this.getViewData();
  }

  getProductTag(viewData) {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/productTag/v1/getProductsTags')
      .subscribe((response) => {
        this.productTagList = response;
        console.log(response);
        console.log(response['exclusiveProducts']);
        console.log(response['exclusiveProducts']);
        this.exclusiveProducts = response['exclusiveProducts'];
        this.limitedTimeProducts = response['limitedTimeProducts'];
        this.healthyProducts = response['healthyProducts'];
        this.hotSellerProducts =  response['hotSellerProducts'];
        this.buildForm(viewData)
      })
  }
  getBrandList() {
    this.http.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
      .subscribe((response) => {
        this.brandList = response;
      })
  }

  getParentList(selectedBrandId) {
    console.log(selectedBrandId);
    if (selectedBrandId != '' && selectedBrandId != null && selectedBrandId != undefined) {
      this.disabledCategory = false;
      this.http
          .getJson(
            environment.APIEndpoint +
            "api/rpa/productcategory/v1/get/brandCategories?brandId=" +selectedBrandId)
          .subscribe(response => {
      console.log(response);
      this.parentList = response;
   console.log(this.parentList);
      response.forEach(response => {
        this.parentList.push({
                    categoryId: response.categoryId,
                    categoryName: response.categoryName,
                    direction: response.direction,
                    parentProductCategoryId: response.parentProductCategoryId,
                    status: response.status,
                    value: response.categoryId
        });
        
        this.categoriesList = this.parentList;
        console.log(this.categoriesList);
        var uniqueArray = this.removeDuplicatesJSON(this.parentList, 'categoryId');
        console.log(uniqueArray);
        this.parentList = uniqueArray;
      });
      console.log(this.parentList);
      this.categoriesList = this.parentList;
    }, err => {
      console.log(err);
    });
  }
  else{
    this.parentList = [];
    this.categoriesList = [];
    this.selectedCategoryOptions = [];
  }
}

removeDuplicatesJSON(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};
  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}



  getViewData() {
    this.id = this.router.url.split('edit-products/')[1];
    let data = {
      "productOid": parseFloat(this.id),
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/product/v1/view", data).subscribe(res => {
      console.log(res);
      this.viewData = res;
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.imgUpload = true;
      this.selectedCount = res["selectedStoreCount"];
      this.totalCount = res["totalStoreCount"];
      this.sortOrder = res["sortOrder"];
      this.parentList = res['categories'];
      console.log(this.parentList);
      this.brandId = res['brand'].brandId;
      console.log(this.brandId);
      this.getProductTag(this.viewData);

      if (this.brandId != '') {
        // this.categoryIds = res['categories'].categoryOid;
        // console.log(this.categoryIds);
        for (const category of this.parentList) {
          this.selectedCategoryOids.push(category.categoryOid);
          console.log(category.categoryOid);
          console.log(this.selectedCategoryOids);
        }
        this.getParentList(this.brandId);
      }else{
        this.selectedCategoryOptions = [];
      }

      this.buildForm(this.viewData);
      for (let prod of this.viewData["productLocales"]) {
        this.alignCss.push(prod.languageDirection == 'RTL' ? 'text-right' : '');
        this.rightPanel.push(prod.languageDirection == 'RTL' ? 'right-panel' : '');
        this.languageDirection.push(prod.languageDirection == 'RTL' ? 'direction' : '');
      }

      if (this.brandId) {
        this.editProductGroup.patchValue({
          parentId: this.selectedCategoryOids,
        });
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

  public removeImage(index, img) {
    if (this.defaultId == index && this.imagePath[index]['img'] == img) {
      this.defaultId = undefined;
    }
    this.imagePath.splice(index, 1);
  }

  public removeImageDieatry(index) {
    this.imagePathDieatry.splice(index, 1);
  }

  public removeImageAlergion(index) {
    this.imagePathAlergion.splice(index, 1);
  }

  endDateAction(value) {
    let availTo = this.editProductGroup.get('availTo');
    if (value == "") {
      availTo.clearValidators();
      availTo.updateValueAndValidity();
    } else {
      availTo.setValidators([Validators.required]);
      availTo.updateValueAndValidity();
    }
  }

  alertDialog(): void {
    const dialogReference = this.dialog.open(productOnlineOfflineDialog, {
      width: '350px',
    });
    // dialogReference.componentInstance.statusValue = this.statusValue;
    dialogReference.afterClosed().subscribe(result => {
      if (result) {
        this.toggleVal = !this.toggleVal;
      }
    });
  }

  public buildForm(viewData) {
    this.imageErr = false;
    this.count = 0;
    this.imageErrMsg = "";
    this.imagePath = [];
    this.imagePathDieatry = [];
    this.imagePathAlergion = [];
    if (viewData.length == 0) {
      let form = {
        productFormArray: this.fb.array([])
      }
      this.editProductGroup = this.fb.group(form);
    } else {
      this.buildFlag = true;
      // this.getParentList(viewData.brand.brandId);
      // this.parentIdsObj = viewData.categories.map(function (item) {
      //   return item.categoryOid;
      //   // this.parentIdsObj.push(item.categoryId);
      // })
      
      console.log(this.parentIdsObj)
      let availFrom = new Date();
      let availTo = new Date();

      if (viewData.availableFrom != "" && viewData.availableFrom != null) {
        var hh = viewData.availableFrom.split(":");
        availFrom.setHours(hh[0]);
        availFrom.setMinutes(hh[1]);
      }

      if (viewData.availableTo != "" && viewData.availableTo != null) {
        var hh = viewData.availableTo.split(":");
        availTo.setHours(hh[0]);
        availTo.setMinutes(hh[1]);
      }

      // alert("form data");
      this.editProductGroup = this.fb.group({
        productFormArray: this.fb.array([]),
        brandId: [viewData.brand.brandId, Validators.compose([Validators.required])],
        parentId: [this.selectedCategoryOids, Validators.compose([Validators.required])],
        sortorder: [viewData.sortOrder, Validators.compose([Validators.required, Validators.max(this.sortOrder)])],
        quantityThreshold: [545],
        isExclusive: [viewData.exclusive],
        isLimitedTimeCategory: [viewData.limitedTimeCategory],
        isHealthy: [viewData.healthy],
        isHotSeller: [viewData.hotSeller],
        // isExclusive: [this.exclusiveProducts == '' || this.exclusiveProducts == undefined ? false : true],
        // isLimitedTimeCategory: [this.limitedTimeProducts == '' || this.limitedTimeProducts == undefined ? false : true],
        // isHealthy: [this.healthyProducts == '' || this.healthyProducts == undefined ? false : true],
        // isHotSeller: [this.hotSellerProducts == '' || this.hotSellerProducts == undefined ? false : true],
        discount: [viewData.discountPercentage, Validators.compose([Validators.required])],
        packing: [viewData.packingCharge, Validators.compose([Validators.required])],
        availFrom: [viewData.availableFrom != "" && viewData.availableFrom != null ? availFrom : "",Validators.compose([Validators.required])],
        availTo: [viewData.availableTo != "" && viewData.availableTo != null ? availTo : "",Validators.compose([Validators.required])],
        // defaultCakeSize: [viewData.defaultCakeSize],
        // disclaimer: [viewData.disclaimer],
        productType: [viewData.productType],
        // storeField: [this.selectedCount, Validators.compose([Validators.min(1)])],
        // skucode: [viewData.skuCode, Validators.compose([Validators.required])],
        // displayPrice: [viewData.displayPrice, Validators.compose([Validators.required])],
        // costPrice: [viewData.costPrice],
        // inventory: [viewData.inventory],
        // minInventory: [viewData.minimumInventory],
        // taxPrice: [viewData.taxRate],
        // weight: [viewData.weight, Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])]
      })
      for (let ln of viewData.productLocales) {
        const control = <FormArray>this.editProductGroup.controls['productFormArray'];
        let newGroup = this.fb.group({
          name: [this.module == 'edit' ? ln.productName : "", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
          ingredients: [ln.ingredients],
          metaTag: [ln.metaTag, Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])],
          // description: [ln.productDesc, Validators.compose([Validators.required])],
          description: [ln.productDesc],
        });
        control.push(newGroup);
      }

      //  let storeobj = [];
      //   for(let i=0; i< viewData.stores.length; i++){
      //     if(viewData.displayPrice != viewData.stores[i].price){
      //       this.priceLabel = "Different Price";
      //     }
      //     let obj = {
      //     storeId: viewData.stores[i].storeId,
      //     price: viewData.stores[i].price
      //   }
      //   storeobj.push(obj);
      // }
      // this.selectedStorearray = storeobj;

      if (this.module == 'edit') {
        for (let i = 0; i < viewData.productImages.length; i++) {
          let obj = {
            imgPath:viewData.productImages[i].imgPath,
            isDefault:viewData.productImages[i].isDefault
          }
          if(viewData.productImages[i].isDefault==true){
            this.defaultId = i;
          }
          this.imagePath.push(obj)
          // this.imagePath.push(viewData.productImages[i].imgPath);
          // if (viewData.productImages[i].isDefault) {
          //   this.defaultId = i;
          // }
          this.imgUpload = false;
        }

        for (let i = 0; i < viewData.productDieatry.length; i++) {
          let obj = {
            name: viewData.productDieatry[i].name,
            imgPath: viewData.productDieatry[i].imgPath
          }
          this.imagePathDieatry.push(obj);
        }
        for (let i = 0; i < viewData.productAlergion.length; i++) {
          let obj = {
            name: viewData.productAlergion[i].name,
            imgPath: viewData.productAlergion[i].imgPath
          }
          this.imagePathAlergion.push(obj);
        }
      }

      //    this.addOnarray.map(function (item) {
      //     if(viewData.addons.indexOf(item.value) > -1){
      //       item.checked = true;
      //     }
      // });

      // if (viewData.addonCols.length > 0) {
      //   for (let j = 0; j < viewData.addonCols.length; j++) {
      //     this.columnHeadArr[j] = viewData.addonCols[j].label;
      //     this.columnArr[j] = viewData.addonCols[j].value;
      //     this.columns.push(j + 1);
      //   }
      //   this.count = viewData.addonCols.length;
      // }

    }
  }
  incrementColumn() {
    this.count += 1;
    if (this.count < 3) {
      this.columns.push(this.count);
    }
  }

  public uploadImage(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUpload = true;
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
      if (event[0].size < 1000000) {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            
            let obj = {
              imgPath:response['message'],
              isDefault:false
            }
            this.imagePath.push(obj);
            //  this.imagePath.push(response['message']);
            this.imgUpload = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
          })
      } else {
        this.imageErr = true;
        this.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
    }
  }


  public uploadImageDieatry(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUploadDieatry = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg"
    ) {
      if (event[0].size < 1000000) {
        this.uploadFile
          .upload(event.item(0), "brandCategory", "images")
          .subscribe(
            response => {
              this.imagePathDieatry.push(response["message"]);
              this.imgUploadDieatry = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            },
            err => { }
          );
      } else {
        this.imageErr = true;
        this.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
    }
  }

  public uploadImageAlergion(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUploadAlergion = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg"
    ) {
      if (event[0].size < 1000000) {
        this.uploadFile
          .upload(event.item(0), "brandCategory", "images")
          .subscribe(
            response => {
              this.imagePathAlergion.push(response["message"]);
              this.imgUploadAlergion = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            },
            err => { }
          );
      } else {
        this.imageErr = true;
        this.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnInit() {
    console.log(this.languageList);
  }

  onChange(mrChange: MatRadioChange) {
    this.defaultId = mrChange.value;
  }

  // storeDialog() {
  //   const dialogRef = this.dialog.open(storeDialog);
  //   dialogRef.componentInstance.storeList = this.selectedStorearray;
  //   dialogRef.componentInstance.priceVal = this.price;
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result.buttonName === 'SELECT'){
  //       console.log('result st', result);
  //       this.minCount = result.tableData.length;
  //       this.selectedCount = result.tableData.length;
  //       this.totalCount = result.totalCount;
  //       let storeobj = [];
  //       for(let i = 0; i< result.tableData.length; i++){
  //         var val = result.price[result.tableData[i].storeId];
  //             if(val === undefined || val.length == 0){
  //               this.minCount = 0;
  //               this.errorMsg = "Please enter price value";
  //             }
  //             if(this.price != val){
  //               this.priceLabel = "Different Price";
  //             }
  //             let obj = {
  //               storeId: result.tableData[i].storeId,
  //               price: val
  //             }
  //               storeobj.push(obj);
  //       }
  //           this.selectedStorearray = storeobj;
  //           this.editProductGroup.patchValue({
  //               storeField:this.minCount
  //           });
  //       }
  //     });
  // }

  priceLable(value) {
    if (value.length != 0 && this.viewData.displayPrice != value) {
      this.price = value;
      if (this.selectedStorearray.length > 0) {
        this.selectedStorearray.forEach((i) => {
          i["price"] = value;
        });
      }
      this.priceLabel = "Same Price";
    }
  }

  // addOnstDialog(): void {
  //   const dialogRf = this.dialog.open(DialogAddOns, {
  //     width: '250px',
  // });
  // dialogRf.componentInstance.array = this.addOnarray;
  //   dialogRf.afterClosed().subscribe(result => {
  //       dialogRf.componentInstance.array = this.addons;
  //       if(typeof result !== "undefined"){
  //         this.addons = result.filter(x => x.checked === true).map(x => x.value);
  //       }
  //   });

  // }

  removeaddOn(index) {
    this.addons.splice(index, 1);
    this.addOnarray[index].checked = false;
  }

  updateProduct(formData) {
    console.log(this.editProductGroup)
    if (this.editProductGroup.invalid == true) {
      this.markFormGroupTouched(this.editProductGroup);
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;
      let prodLocales = [];
      for (var i = 0; i < formData.productFormArray.length; i++) {
        if (formData.productFormArray[i].name != "") {
          let obj = {
            languageOid: this.viewData.productLocales[i].languageOid,
            productName: formData.productFormArray[i].name,
            // calorieCount: formData.productFormArray[i].calorieCount,
            ingredients: formData.productFormArray[i].ingredients,
            metaTag: formData.productFormArray[i].metaTag,
            productDesc: formData.productFormArray[i].description
          }
          prodLocales.push(obj);
        }
      }

      let prodImages = [];
      if (this.imagePath.length > 0) { 
        for (var i = 0; i < this.imagePath.length; i++) {
          let images = {
            isDefault: this.defaultId == i ? true : false,
            // imgPath: this.imagePath[i]
            imgPath: this.imagePath[i]['imgPath']
          }
          prodImages.push(images);
        }
      }

      let dieatryImages = [];
      if (this.imagePathDieatry.length > 0) {
        for (var i = 0; i < this.imagePathDieatry.length; i++) {
          // let obj = {
          //   imgPathDieatry: this.imagePathDieatry[i]
          // };
          dieatryImages.push(this.imagePathDieatry[i]);
        }
      }

      let alergionImages = [];
      if (this.imagePathAlergion.length > 0) {
        for (var i = 0; i < this.imagePathAlergion.length; i++) {
          // let imagesAlergion = {
          //   // isDefault: this.defaultId == i ? true : false,
          //   imgPathDieatry: this.imagePathAlergion[i]
          // };
          alergionImages.push(this.imagePathAlergion[i]);
        }
      }

      // let addonColumns = []
      // if (this.columnHeadArr.length > 0) {
      //   for (let i = 0; i < this.columnHeadArr.length; i++) {
      //     let obj = {
      //       label: this.columnHeadArr[i],
      //       value: this.columnArr[i]
      //     }
      //     addonColumns.push(obj);
      //   }
      // }

      let updateProductReq = {
        productOid: parseFloat(this.id),
        brandOid: formData.brandId,
        categoryOids: formData.parentId,
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        isExclusive: formData.isExclusive,
        isLimitedTimeCategory: formData.isLimitedTimeCategory,
        isHealthy: formData.isHealthy,
        isHotSeller: formData.isHotSeller,
        productType: formData.productType,
        sortOrder: formData.sortorder,
        quantityThreshold: parseInt(formData.quantityThreshold),
        discountPercentage: formData.discount,
        packingCharge: formData.packing,
        availableFrom: formData.availFrom != '' ? moment(formData.availFrom).format('HH:mm:ss') : '',
        availableTo: formData.availTo != '' ? moment(formData.availTo).format('HH:mm:ss') : '',
        // defaultCakeSize: formData.defaultCakeSize,
        // disclaimer: formData.disclaimer,
        productLocales: prodLocales,
        productImages: prodImages,
        productDieatry: dieatryImages,
        productAlergion: alergionImages,
        // stores: this.selectedStorearray,
        // addons: this.addons,
        // skuCode: formData.skucode,
        // costPrice: formData.costPrice,
        // displayPrice: formData.displayPrice,
        // inventory: formData.inventory,
        // minimumInventory: formData.minInventory,
        // taxRate: formData.taxPrice,
        // weight: formData.weight,
        // addonCols: addonColumns
      }
      console.log(updateProductReq);
      this.module == "clone" ? delete updateProductReq.productOid : updateProductReq;
      this.pageLoader = true;
      var url = this.module == "clone" ? "api/rpa/product/v1/create" : "api/rpa/product/v1/update";
      this.http.postJson(environment.APIEndpoint + url, updateProductReq)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Product is Saved successfully"
            }
          });
          this.loading = false;
          this.pageLoader = false;
          this.router.navigate(['/search-products']);
        }
          , err => {
            this.loading = false;
            this.pageLoader = false;
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


  // dietry & allergion dialogs
  openDieatryDialog() {
    const dialogRef = this.dialog.open(DieatryImageDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        this.imagePathDieatry.push(result);
    });
  }

  openAlergionDialog() {
    const dialogRef = this.dialog.open(AlergionImageDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        this.imagePathAlergion.push(result);
    });
  }

  expandDataEmail() {
    var allifram = document.getElementById("arabicID");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
  expandDataEmailDescrtipion() {
    var allifram = document.getElementById("arabicIDDescrtipion");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
}