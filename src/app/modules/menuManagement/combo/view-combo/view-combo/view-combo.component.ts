import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule } from '@angular/material';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Globals } from 'src/app/services/global';
import { __values } from 'tslib';

@Component({
  selector: 'app-view-combo',
  templateUrl: './view-combo.component.html',
  styleUrls: ['./view-combo.component.scss']
})
export class ViewComboComponent implements OnInit {
  public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };

  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Combo',
    link: ''
  }
  ];
  public alignCss = [];
  comboType;
  public imagePath: string = '';
  imageUploading;
  showImageError;
  viewID;
  viewData:any;
  public filePathUrl = localStorage.getItem("imgBaseUrl");

  public languageList = JSON.parse(localStorage.getItem("languageList"));
  createComboFormGroup: FormGroup;
  public storeID = 0;
  public toggleVal = true;
  public checked;
  public loading:boolean = true;
  languageDirection: any =[];
  constructor(private fb: FormBuilder, private http: HttpService,public dialog: MatDialog,
    private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar) { }
    availableFrom;
    availableTo;
    viewDataCheck=false;
    selectedIndex: number = 0;

  ngOnInit() {
    let data = localStorage.getItem('comboViewID');
    if (data) {
      this.viewID = data;
      this.getViewData();
      localStorage.removeItem('comboViewID')

    }else{
      this.router.navigate(['/search-combo'])
    }

  }

  skuCodeData1;
  skuCodeData2;
  skuCodeData3;
  deliveryStore=[];
  pickupStore=[];
  dineInStore=[];
  storeGroup=[];
  storeGroupPickup=[];
  storeGroupDineIn=[];
  isDeliveryEnabled:boolean;
  isPickupEnabled:boolean;
  isDineInEnabled:boolean;
  getViewData() {
    let data =
    {
      "comboId": this.viewID,
    }
    let URL = environment.APIEndpoint + "api/rpa/combo/v1/view";
    this.http.postJson(URL, data)
      .subscribe((response) => {
        this.viewData = response;
        this.toggleVal = response["status"] == "ONLINE" ? true : false;
        this.checked = response['status'] == 'ONLINE' ? true : false;
        // this.buildForm();
        console.log(response)
        if (this.viewData['availableFrom'] != null) {
          this.availableFrom = new Date();
          let e = this.viewData['availableFrom'].split(":");
          this.availableFrom.setHours(e[0]);
          this.availableFrom.setMinutes(e[1]);
        }
        if (this.viewData['availableTo'] != null) {
          this.availableTo = new Date();
          let t = this.viewData['availableTo'].split(":");
          this.availableTo.setHours(t[0]);
          this.availableTo.setMinutes(t[1]);
        }

        for(let i=0;i<=this.viewData['comboOrderType'].length-1;i++){
          if(this.viewData['comboOrderType'][i].orderDeliveryType=='DELIVERY'){
            this.skuCodeData1=this.viewData['comboOrderType'][i].comboSkuDetails;
            this.deliveryStore=this.viewData['comboOrderType'][i].comboStoreGroup;
            this.storeGroup=this.viewData['comboOrderType'][i].comboCarts;
            this.isDeliveryEnabled = this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable;

          }else if(this.viewData['comboOrderType'][i].orderDeliveryType=='PICKUP'){
            this.skuCodeData2 =this.viewData['comboOrderType'][i].comboSkuDetails;
            this.pickupStore=this.viewData['comboOrderType'][i].comboStoreGroup;
            this.storeGroupPickup=this.viewData['comboOrderType'][i].comboCarts;
            this.isPickupEnabled = this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable;


          }else{
            this.skuCodeData3 = this.viewData['comboOrderType'][i].comboSkuDetails;
            this.dineInStore=this.viewData['comboOrderType'][i].comboStoreGroup;
            this.storeGroupDineIn=this.viewData['comboOrderType'][i].comboCarts;
            this.isDineInEnabled = this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable;



          }
        }
        for (let prod of this.viewData["comboDescription"]) {
          this.alignCss.push(prod.languageName == 'Arabic' ? 'text-right' : '');
          this.languageDirection.push(prod.languageName == 'Arabic' ? 'direction' : '');
        }
        this.viewDataCheck=true;

        this.loading=false;

      });

  }

  public buildForm() {
    this.createComboFormGroup = this.fb.group({
      comboName: this.fb.array([]),
      // bannerName: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF.\"&\'(),-:.?_ ]*')])],
      availFrom: [""],
      availTo: '',
      brand: '',
      category: '',
      title: this.fb.array([]),
      pageContent: this.fb.array([]),
      noOfStep: '',
      country: '',
      sortOrder: '',
      skuCode: '',
      packingCharge: '',
      deliveryCharge: '',
      taxRates: '',
      currency: '',
      currencyValue: ''
    });

    this.comboNameData();
    this.titleData();
  }
  titleData() {
    const control = <FormArray>this.createComboFormGroup.controls['title'];
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
        title: '',
        LanguagOid: this.languageList[i].languageId,

      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }
  comboNameData() {
    const control = <FormArray>this.createComboFormGroup.controls['comboName'];
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
        comboName: '',
        LanguagOid: this.languageList[i].languageId,

      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }
  updateValidatiopn(value) {

  }
  removeImage() {
    this.imagePath = '';
  }
  public uploadImage(event: FileList) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.upload(event.item(0), 'productAddon', 'images')
            .subscribe((response) => {
              console.log(response);
              this.imagePath = response['message'];
              this.imageUploading = false;
              this.showImageError = false;
              // this.uploadElRef.nativeElement.value = ''
              console.log("res ::: " + response)
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {


              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading = false;
          // this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }
  moveToEdit() {
    localStorage.setItem('comboViewID', this.viewID);
    this.router.navigate(['/edit-combo'])
  }
  openStoresDialog() {
    const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.componentInstance.selectedStoreData = this.viewData['comboStore'];
    dialogRef.afterClosed().subscribe(
      (result) => {

      }
    );
  }

nextStep() {
  
    if (this.selectedIndex == 0) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  

}
public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  

  console.log(tabChangeEvent.index);
  if (tabChangeEvent.index == 1) {
    this.selectedIndex = 1;

  } else if (tabChangeEvent.index == 0) {
    this.selectedIndex = 0;

  }

}
previousStep() {
if (this.selectedIndex != 0) {
  this.selectedIndex = this.selectedIndex - 1;
}
console.log(this.selectedIndex);
}
}
