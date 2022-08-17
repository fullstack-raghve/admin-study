import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { MatSnackBar, MatRadioChange } from "@angular/material";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { UploadFile } from "src/app/services/uploadFile.service";
// import { storeDialog } from "../../store-dialog/add-store.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as moment from "moment";
import { DieatryImageDialog } from '../../dieatry-image-dialog/dieatry-image-dialog.component';
import { AlergionImageDialog } from '../../alergion-image-dialog/alergion-image-dialog.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: "add-products",
  templateUrl: "./add-products.component.html",
  styleUrls: ["./add-products.component.scss"]
})
export class AddProductsComponent implements OnInit {

  public breadCrumbData: Array<Object> = [
    {
      title: "Menu Management",
      link: ""
    },
    {
      title: "Products",
      link: "/search-products"
    }
  ];
  public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };
  // public languageList =JSON.parse(localStorage.getItem("languageList"));
  public imgUpload = false;
  public imgUploadDieatry = false;
  public imgUploadAlergion = false;
  public toggleVal = false;
  public imagePath = [];
  public imagePathDieatry = [];
  public imagePathAlergion = [];
  public showError = false;
  public imageErrMsg = "";
  public imageErr = false;
  public loading = false;
  public imageUploading = false;
  public statusValue: string = "Online";
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public parentList = [];
  public brandList = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public selectedStorearray = [];
  public addProductGroup: FormGroup;
  public totalCount = 0;
  public selectedCount = 0;
  public minCount = 0;
  sortOrder;
  defaultId = 0;
  addons = [];
  columns = [];
  columnArr = [];
  columnHeadArr = [];
  public alignCss = [];
  public rightPanel = [];
  selectedCategoryOptions: any[];
  count = 0;
  errorMsg = "Please select value";
  priceLabel = "";
  price;
  categoriesList: any[];
  languageDirection = [];
  @ViewChild('categoryInput') categoryInput: SelectAutocompleteComponent;
  productTagList = [];
  productList = [];
  exclusiveProducts: any;
  hotSellerProducts: any;
  healthyProducts: any;
  limitedTimeProducts: any;
  public pageLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    public dialog: MatDialog,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.getProductTag();
    this.buildCreateProductForm();
    this.getBrandList();

    let data = {
      order: {
        column: "storeId",
        dir: "asc"
      },
      keySearch: "",
      fieldSearch: [
        {
          fieldName: "mall.city.oid",
          fieldValue: ""
        },
        {
          fieldName: "mall.city.country.oid",
          fieldValue: ""
        }
      ]
    };
    this.http
      .postJson(environment.APIEndpoint + "api/rpa/store/v2/getAll", data)
      .subscribe(res => {
        this.totalCount = res["totalCount"];
      });
  }
  ngOnInit() {
    this.getSortOrder();
  }
  getProductTag() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/productTag/v1/getProductsTags')
      .subscribe((response) => {
        this.productTagList = response;
        console.log(response);
        console.log(response['exclusiveProducts']);
        console.log(response['limitedTimeProducts']);
        this.exclusiveProducts = response['exclusiveProducts'];
        this.limitedTimeProducts = response['limitedTimeProducts'];
        this.healthyProducts = response['healthyProducts'];
        this.hotSellerProducts =  response['hotSellerProducts'];
        console.log(this.exclusiveProducts);
        console.log(this.limitedTimeProducts);
        this.buildCreateProductForm();
      })
  }

  getBrandList() {
    this.http
      .getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
      .subscribe(response => {
        this.brandList = response;
      });
  }

  // categories1 = [];
  // getParentList(brandId) {
  //   this.http
  //     .getJson(
  //       environment.APIEndpoint +
  //       "api/rpa/productcategory/v1/get/brandCategories?brandId=" +brandId)
  //     .subscribe(response => {
  //       this.parentList = response;
  //       this.parentList.forEach(res => {
  //         this.categories1.push({
  //           "categoryId": res.categoryId,
  //           "categoryName": res.categoryName,
  //           "direction": res.direction,
  //           "parentProductCategoryId": res.parentProductCategoryId,
  //           "status": res.status,
  //           "value": res.categoryId
  //         });
  //       });
  //     });
  // }

  getParentList(selectedBrandId) {
    this.selectedCategoryOptions = [];
    this.categoryInput.selectAllChecked = false;
    if (selectedBrandId != '' && selectedBrandId != null && selectedBrandId != undefined) {
      this.http
          .getJson(
            environment.APIEndpoint +
            "api/rpa/productcategory/v1/get/brandCategories?brandId=" +selectedBrandId)
          .subscribe(response => {
      console.log(response);
      this.categoriesList = [];
      response.forEach(response => {
        this.categoriesList.push({
          "categoryId": response.categoryId,
                    "categoryName": response.categoryName,
                    "direction": response.direction,
                    "parentProductCategoryId": response.parentProductCategoryId,
                    "status": response.status,
                    "value": response.categoryId
        });
        var uniqueArray = this.removeDuplicatesJSON(this.categoriesList, 'categoryId');
        console.log(uniqueArray);
        this.categoriesList = uniqueArray;
      });
      console.log(this.categoriesList);
    }, err => {
      console.log(err);
    });
  }
  else{
    this.categoriesList = [];
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


  getSortOrder() {
    this.http
      .getJson(environment.APIEndpoint + "api/rpa/product/v1/get/sortOrder")
      .subscribe(response => {
        this.sortOrder = response["sortOrder"];
        this.addProductGroup.patchValue({
          sortorder: this.sortOrder
        });
        this.addProductGroup.controls["sortorder"].setValidators(
          Validators.compose([
            Validators.required,
            Validators.max(this.sortOrder)
          ])
        );
      });
  }

  incrementColumn() {
    this.count += 1;
    if (this.count < 3) {
      this.columns.push(this.count);
    }
  }

  getLangauges() {
    for (let i = 0; i < this.languageList.length; i++) {
      const control = <FormArray>(
        this.addProductGroup.controls["productFormArray"]
      );
      let newGroup = this.fb.group({
        name: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')
          ])
        ],
        // calorieCount: [
        //   "",
        //   Validators.compose([Validators.pattern("[a-zA-Z0-9\u0600-\u06FF ]*")])
        // ],
        ingredients: [""],
        metaTag: [
          "",
          Validators.compose([Validators.pattern("[a-zA-Z0-9\u0600-\u06FF ]*")])
        ],
        description: [""]

      });
      control.push(newGroup);
      this.alignCss.push(
        this.languageList[i].direction == "RTL" ? "text-right" : ""
      );
      this.rightPanel.push(this.languageList[i].direction == 'RTL' ? 'right-panel' : '');
      this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
    }
  }

  public uploadImage(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUpload = true;
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
              this.imagePath.push(response["message"]);
              this.imgUpload = false;
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

  public buildCreateProductForm() {
    this.imageErr = false;
    this.count = 0;
    this.imageErrMsg = "";
    this.imagePath = [];
    this.imagePathDieatry = [];
    this.imagePathAlergion = [];
    let form = {
      productFormArray: this.fb.array([]),
      brandId: ["", Validators.compose([Validators.required])],
      parentId: ["", Validators.compose([Validators.required])],
      sortorder: [
        "",
        Validators.compose([
          Validators.required,
          Validators.max(this.sortOrder)
        ])
      ],
      quantityThreshold: [''],
    isExclusive: [this.exclusiveProducts == '' ? false : true],
      isLimitedTimeCategory: [this.limitedTimeProducts == '' ? false : true],
      isHealthy: [this.healthyProducts == ''  ? false : true],
      isHotSeller: [this.hotSellerProducts == '' ? false : true],
      productType: ["VEG"],
      discount: ["0", Validators.compose([Validators.required, Validators.maxLength(3)])],
      packing: ["0", Validators.compose([Validators.maxLength(4)])],
      availFrom: ["",Validators.compose([Validators.required])],
      availTo: ["",Validators.compose([Validators.required])],
      // defaultCakeSize: [''],
      // disclaimer: ['']
    };
    this.addProductGroup = this.fb.group(form);
    this.getLangauges();
  }

  endDateAction(value) {
    let availTo = this.addProductGroup.get("availTo");
    if (value == "") {
      availTo.clearValidators();
      availTo.updateValueAndValidity();
    } else {
      availTo.setValidators([Validators.required]);
      availTo.updateValueAndValidity();
    }
  }

  onChange(mrChange: MatRadioChange) {
    this.defaultId = mrChange.value;
  }

  public removeImage(index) {
    this.imagePath.splice(index, 1);
  }

  public removeImageDieatry(index) {
    this.imagePathDieatry.splice(index, 1);
  }

  public removeImageAlergion(index) {
    this.imagePathAlergion.splice(index, 1);
  }

  priceLable(value) {
    if (value.length != 0) {
      this.price = value;
      if (this.selectedStorearray.length > 0) {
        this.selectedStorearray.forEach(i => {
          i["price"] = value;
        });
      }
      this.priceLabel = "Same Price";
    }
  }
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

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createProduct(formData, event) {
    console.log(event);
    console.log(this.addProductGroup.controls);
    if (this.addProductGroup.invalid == true) {
      this.markFormGroupTouched(this.addProductGroup);
      this.showError = true;
    } else {
      this.loading = true;
      this.showError = false;
      let prodLocales = [];
      for (var i = 0; i < formData.productFormArray.length; i++) {
        if (formData.productFormArray[i].name != "") {
          let obj = {
            languageOid: this.languageList[i].languageId,
            productName: formData.productFormArray[i].name,
            // calorieCount: formData.productFormArray[i].calorieCount,
            ingredients: formData.productFormArray[i].ingredients,
            metaTag: formData.productFormArray[i].metaTag,
            productDesc: formData.productFormArray[i].description
          };
          prodLocales.push(obj);
        }
      }

      let prodImages = [];
      if (this.imagePath.length > 0) {
        for (var i = 0; i < this.imagePath.length; i++) {
          let images = {
            isDefault: this.defaultId == i ? true : false,
            imgPath: this.imagePath[i]
          };
          prodImages.push(images);
        }
      }
    
      let createProductReq = {
        brandOid: formData.brandId,
        categoryOids: formData.parentId,
        status: this.toggleVal == true ? "ONLINE" : "OFFLINE",
        isExclusive: formData.isExclusive,
        isLimitedTimeCategory: formData.isExclusive,
        isHealthy: formData.isExclusive,
        isHotSeller: formData.isExclusive,
        productType: formData.productType,
        sortOrder: formData.sortorder,
        quantityThreshold: formData.quantityThreshold,
        discountPercentage: formData.discount,
        packingCharge: formData.packing,
        availableFrom:
          formData.availFrom != ""
            ? moment(formData.availFrom).format("HH:mm:ss")
            : "",
        availableTo:
          formData.availTo != ""
            ? moment(formData.availTo).format("HH:mm:ss")
            : "",
            // defaultCakeSize: formData.defaultCakeSize,
            // disclaimer: formData.disclaimer,
        productLocales: prodLocales,
        productImages: prodImages,
        productDieatry: this.imagePathDieatry,
        productAlergion: this.imagePathAlergion,
      };
      this.pageLoader = true;
      this.http
        .postJson(
          environment.APIEndpoint + "api/rpa/product/v1/create",
          createProductReq
        )
        .subscribe(
          response => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Product is Saved successfully"
              }
            });
            this.loading = false;
            this.pageLoader = false;
            this.router.navigate(["/search-products"]);
          },
          err => {
            this.loading = false;
            this.pageLoader = false;
            if (err.error.errorType == "VALIDATION") {
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
                  message:
                    "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          }
        );
    }
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

