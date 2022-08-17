import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { UploadFile } from '../../../../../services/uploadFile.service';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { SelectedstoreDataComponent } from "../../selectedstore-data/selectedstore-data.component";
import { ExtraValidators } from 'src/app/services/validator-service';
@Component({
  selector: 'app-add-assign-physical-cards',
  templateUrl: './add-assign-physical-cards.component.html',
  styleUrls: ['./add-assign-physical-cards.component.scss']
})
export class AddAssignPhysicalCardsComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Assign Physical Cards',
    link: ''
  }
  ];
  @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
  RangeForm: FormGroup;
  giftCardIdList1=[];
  GenerateRangeForm: FormGroup;
  RangeValue: any;
  CardType: any;
  isSubmitted = false;
  DetailsForm: FormGroup;
  StoreList = [];
  GiftcardList = [];
  storeName='';
  corporateName: any;
  UploadedData: boolean = false;
  SelectedQuantity = []
  PopUPData = [];
  selectedphysicalCards = [];
  selectedphysicalCardPOP = [];
  public Editable = true;
  CorporateList = [];
  CountryCodeList = [];
  checkComment=false;
  checkGiftCard=false;
  uploadFileName: string;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService, private uploadFile: UploadFile,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {

  }

  ngOnInit() {
    this.getCardType();
    this.buildRangeForm();
    this.buildGenerateRangeForm();
    this.buildDetailForm();
    this.getStoreIDs();
    // this.getGiftCardIDs();
    this.getCorporateIDs();
    this.getCountryCodeList();
   
  }
  buildDetailForm() {
    let form = {
      storeCorporate: ["STORE", Validators.compose([Validators.required])],
      selectStore: ['', Validators.compose([ExtraValidators.conditional(
        group => this.DetailsForm.get('storeCorporate').value === 'STORE',
        Validators.required
    )])],
      StoreID: ['', Validators.compose([ExtraValidators.conditional(
        group => this.DetailsForm.get('storeCorporate').value === 'STORE',
        Validators.required
    )])],
    CorporateID: ['', Validators.compose([ExtraValidators.conditional(
      group => this.DetailsForm.get('storeCorporate').value === 'CORPORATE',
      Validators.required
  )])],
      EnterName: ['', Validators.compose([Validators.required])],
      Email: ['', Validators.compose([Validators.required])],
      MobileNumber: ['', Validators.compose([Validators.required])],
      GiftCard: ['', Validators.compose([ExtraValidators.conditional(
        group => this.storeName !== '',
        Validators.required
    )])],
      // selectCorporate:[''],
      // selectCorporate: ['', Validators.compose([Validators.required])],
      selectCorporate: ['', Validators.compose([ExtraValidators.conditional(
                group => this.DetailsForm.get('storeCorporate').value === 'CORPORATE',
                Validators.required
            )])],
      CountryCode: ['', Validators.compose([Validators.required])]
    }
    this.DetailsForm = this.fb.group(form);
  }
  buildGenerateRangeForm() {
    let form = {
      CardID: ["", Validators.compose([Validators.required])],
      Quantity: ['', Validators.compose([Validators.required, Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
      Range: ['', Validators.compose([Validators.required])],
      rangeUpload: ['range', Validators.compose([Validators.required])],
      AssignmentName: ['', Validators.compose([Validators.required])]

    }
    this.GenerateRangeForm = this.fb.group(form);

  }


  public buildRangeForm() {
    this.RangeForm = this.fb.group({
      StartingCardID: [''],
      EndingCardID: [""],
      Quantity: [""],
      Status: [""],
      SelectedQuantity: [""],
      NewStatus: [],
      Comment: ['',Validators.compose([Validators.required])]
    });
  }
  getCardType() {
    let TempURL = "https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type";
    let data = {}
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.CardType = (response['Output']);
      });
  }
  getStoreIDs() {
    let TempURL = "https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_stores";
    let data = {
      "languageCode": "en"
    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.StoreList = (response['Output']);
        // console.log(this.StoreList);
      });
  }
  getCorporateIDs() {
    let TempURL = "https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_list";
    let data = {

    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.CorporateList = (response['Output']);
        // console.log(this.CorporateList);
      });
  }
  getGiftCardIDs() {
    let TempURL = "https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_gift_cards";
    let data = {
      "languageCode": "en",
      "storeId": this.DetailsForm.get('StoreID').value
    }
    this.giftCardIdList1=[]
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        // response['Output']
        console.log(response['Output']);
        if(response['Output'][0] !="No data found"){
          this.GiftcardList = (response['Output']);
          this.GiftcardList.forEach(res => {
                    this.giftCardIdList1.push({
                    "giftCardId":res.giftCardId,
                    "cardName":res.cardName,
                    "value":res.giftCardId
                    });
          });
        }else{
          this.checkGiftCard=true;
        }
       

      });
     
  }
  // getMallList(countryId) {
  //   let GET_MALL = environment.APIEndpoint + "api/rpa/master/mall/v1/getMallByRegion";
  //   this.http.getJson(GET_MALL + '?countryOid=' + countryId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.malls = response;
  //       this.malls.forEach(res => {
  //         this.malls1.push({
  //           "languageDirection": res.languageDirection,
  //           "mallcode": res.mallCode,
  //           "mallId": res.mallId,
  //           "mallName": res.mallName,
  //           "status": res.status,
  //           "value": res.mallId
  //         });
  //       });
  //     })

  getCountryCodeList() {
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/recipient/Upload_File/country_details"
    let data = {

    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        // console.log(response['countryDetails']);
        this.CountryCodeList = (response['countryDetails']);
      });

  }
  getAssigncardDetails(formData) {
    this.isSubmitted = true;
    this.UploadedData = false;
    // console.log(formData);
    // this.RangeForm.reset();
    // this.buildDetailForm.reset();
        // console.log(formData);
    this.buildRangeForm();
    this.buildDetailForm();
    if (this.GenerateRangeForm.invalid) {
      return false;
    } else {
      let TempURL = "https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_detail";
      let data = {
        "assignmentName": formData.AssignmentName,
        "quantity": formData.Quantity,
        "languageCode": "en",
        "cardTypeId": formData.CardID,
        "startRange": formData.Range.trim()

      }
      // console.log(JSON.stringify(data))
      return this.http.postCustomizeJson(TempURL, data)
        .subscribe((response) => {
          console.log(JSON.stringify(response));
          let data = response['Output'];
          this.SelectedQuantity = [];
          this.selectedphysicalCards = [];
          let status = "Available-" + data['availableCount'];
          this.RangeForm.get('StartingCardID').patchValue(data['startingCardId']);
          this.RangeForm.get('EndingCardID').patchValue(data['endingCardId']);
          this.RangeForm.get('Quantity').patchValue(data['Quantity']);
          this.RangeForm.get('Status').patchValue(status);
          this.RangeForm.get('NewStatus').patchValue('Assigned');
          this.RangeForm.get('SelectedQuantity').patchValue(data['availbleCard'].length);
          // console.log(data['availbleCard'])
          this.PopUPData = data['availbleCard'];
          this.Editable = false;
          this.selectedphysicalCardPOP = data['availbleCard'];
          for (let i = 0; i <= data['availbleCard'].length - 1; i++) {
            let key = data['availbleCard'][i]['giftcardCodeId'];
            this.selectedphysicalCards.push(key);
          }

        },

          err => {
            // console.log(err);
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 3000,
              data: {
                status: "failure",
                message: err['error']['Error_message']
              }
            }
            );
          });
    }
  }
  public uploadPhysicalCard(event: FileList, value) {
    // console.log(event)
    if (event[0].size < 300000) {
      if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile
          .AssignPhysicalCardUpload(event.item(0), value,'https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_bulk_upload')
          .subscribe(
            response => {
              console.log(JSON.stringify(response));
              console.log(event[0].name);
              this.uploadFileName=event[0].name
              this.SelectedQuantity = [];
              this.selectedphysicalCards = [];
              let data = response['Output'];
              let status = "Available-" + data['availableStatusCount'];
              this.RangeForm.get('StartingCardID').patchValue(data['startRange']);
              this.RangeForm.get('EndingCardID').patchValue(data['endRange']);
              this.RangeForm.get('Quantity').patchValue(data['quantity']);
              this.RangeForm.get('Status').patchValue(status);
              this.RangeForm.get('NewStatus').patchValue('Assigned');
              this.RangeForm.get('SelectedQuantity').patchValue(data['availbleCard'].length);
              this.Editable = false;
              this.UploadedData = true;
              this.PopUPData = data['availbleCard'];
              this.selectedphysicalCardPOP = data['availbleCard'];
              for (let i = 0; i <= data['availbleCard'].length - 1; i++) {
                let key = data['availbleCard'][i]['giftcardCodeId'];
                this.selectedphysicalCards.push(key);
              }
            },
            err => {
              // console.log(err);
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 3000,
                data: {
                  status: "failure",
                  message: err['error']['Error_message']
                }
              }
              );


            });

      }

    } else {

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }

  }
  SelectedStoreID(value) {
    let key = this.StoreList[value]['STORE_OID'];
    this.DetailsForm.get('StoreID').patchValue(key);
    this.storeName = this.StoreList[value]['STORE_NAME'];
    this.corporateName = '';
    this.GiftcardList= [];
    this.checkGiftCard=false;
    this.getGiftCardIDs();
  }
  SelectedCorporateID(val) {
    let key = this.CorporateList[val]['corporateId'];
    this.DetailsForm.get('CorporateID').patchValue(key);
    this.storeName = '';
    this.corporateName = this.CorporateList[val]['corporateName']
  }


  addAssignPhysicalCard(val) {
    let Obj = {}
    let valdata = this.GenerateRangeForm.get('rangeUpload').value;
    let storeCorporate = this.DetailsForm.get('storeCorporate').value;
    let ID;
    let storeName;
    if(this.RangeForm.valid){
    if (storeCorporate != 'STORE') {
      ID=val.CorporateID;
      this.DetailsForm.get('GiftCard').reset();
      storeName=this.corporateName;
    }else{
      ID=val.StoreID;
      storeName=this.storeName;
    }

    if (valdata == 'range') {
      Obj = {
        "assignmentName": this.GenerateRangeForm.get('AssignmentName').value,
        "languageCode": "en",
        "cardTypeId": this.GenerateRangeForm.get('CardID').value,
        "startRange": this.GenerateRangeForm.get('Range').value,
        "quantity": this.GenerateRangeForm.get('Quantity').value,
        "startingCardId": this.RangeForm.get('StartingCardID').value,
        "endingCardId": this.RangeForm.get('EndingCardID').value,
        "COMMENT": this.RangeForm.get('Comment').value,
        "assignTo": val.storeCorporate,
        "contactName": val.EnterName,
        "contactEmail": val.Email,
        "contactNumber": val.CountryCode + '-' + val.MobileNumber,
        "storeName": storeName,
        "storeId":ID,
        "selectedQuantity": this.selectedphysicalCards.length,
        "selectedphysicalCards": this.selectedphysicalCards
      }
    } else {
      Obj = {
        "assignmentName": this.GenerateRangeForm.get('AssignmentName').value,
        "languageCode": "en",
        "cardTypeId": this.GenerateRangeForm.get('CardID').value,
        "startRange": this.RangeForm.get('StartingCardID').value,
        "quantity": this.RangeForm.get('Quantity').value,
        "startingCardId": this.RangeForm.get('StartingCardID').value,
        "endingCardId": this.RangeForm.get('EndingCardID').value,
        "COMMENT": this.RangeForm.get('Comment').value,
        "assignTo": val.storeCorporate,
        "contactName": val.EnterName,
        "contactEmail": val.Email,
        "contactNumber": val.CountryCode + '-' + val.MobileNumber,
        "storeName": storeName,
        "storeId": ID,
        "selectedQuantity": this.selectedphysicalCards.length,
        "selectedphysicalCards": this.selectedphysicalCards
      }
    }
    if (val.storeCorporate == 'STORE') {
      Obj['giftCards'] = val.GiftCard
    }
    if (this.DetailsForm.invalid) {

    } else {
      console.log(JSON.stringify(Obj));
      let TempURL = "https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_add"

      // console.log(JSON.stringify(Obj))
      return this.http.postCustomizeJson(TempURL, Obj)
        .subscribe((response) => {
          // console.log(JSON.stringify(response));
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Assignment made successfully"
            }
          });
          this.router.navigate(["search-assign-physical-cards"]);
        },

          err => {
            // console.log(err);
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 3000,
              data: {
                status: "failure",
                message: err['error']['Error_message']
              }
            }
            );
          });
     } }else{
       this.checkComment=true;
     }
  }


  addGiftCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    // console.log(this.PopUPData);
    let value: any;
    if (this.PopUPData.length == this.selectedphysicalCardPOP.length) {
      value = true
    } else {
      value = false
    }
    const dialogRef = this.dialog.open(SelectedstoreDataComponent,
      {panelClass: 'dialoggiftcardStyleChange'}
    ); dialogRef.componentInstance.selectedphysicalCards = this.selectedphysicalCards;
    dialogRef.componentInstance.GiftCardDetails = this.PopUPData;
    dialogRef.componentInstance.selectAll = value;
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));
      let TempData = result['tableData'];
      this.selectedphysicalCards = [];
      if (result.buttonName === "SELECT") {
        // this.selectedUser = [];
        this.selectedphysicalCards = [];
      let selectedCount = result.tableData.length;
        if (selectedCount !== 0) {
          this.selectedphysicalCardPOP = result['tableData'];
      for (let i = 0; i <= TempData.length - 1; i++) {
        let key = TempData[i]['giftcardCodeId'];
        this.selectedphysicalCards.push(key);
      }
        }
      }


   
      this.RangeForm.get('SelectedQuantity').patchValue(this.selectedphysicalCards.length);


    });
  }
  checkType(val) {
    this.Editable = true;
    this.RangeForm.reset();
    if (val == 'range') {
      this.UploadedData = true;
      this.GenerateRangeForm.get('Range').reset();
      this.GenerateRangeForm.get('Quantity').reset();
    } else {
      this.UploadedData = false;
    }
  }
  checkComments(){
    this.checkComment=false;
  }
  changeValidation(ev) {
    console.log(ev);
    this.storeName='';
    this.corporateName='';
    this.DetailsForm.get('StoreID').patchValue('');
    this.DetailsForm.get('CorporateID').patchValue('');
    this.DetailsForm.get('selectCorporate').patchValue('');
     this.DetailsForm.get('selectStore').patchValue('');
     this.DetailsForm.get('GiftCard').patchValue('');

     if(ev.value=='STORE'){
      this.GiftcardList= [];
      // this.getGiftCardIDs();
     }
     
  }
}
