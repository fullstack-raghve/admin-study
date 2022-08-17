import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatButtonToggleModule} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SelectRecipientDialogComponent } from '../select-recipient-dialog/select-recipient-dialog.component';
import {MatStepperModule} from '@angular/material/stepper';
import { TermConditionDialogComponent } from '../../term-condition-dialog/term-condition-dialog.component';
import * as moment from 'moment';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { SelectedstoreDataComponent } from "../../../assign-physical-cards/selectedstore-data/selectedstore-data.component";
import { UploadFile } from '../../../../../services/uploadFile.service';
import { MatStepper } from '@angular/material/stepper';
import { ExtraValidators } from 'src/app/services/validator-service';

//table
export interface DisplayData {
  Corporate_name: string;
  empId: number;
  USER_NAME: number;
  EMAIL: string;
  Phone_NUMBER: string 
}

// const DisplayDeatils: DisplayData[] = [];
 @Component({
  selector: 'app-add-gifting',
  templateUrl: './add-gifting.component.html',
  styleUrls: ['./add-gifting.component.scss']
})


export class AddGiftingComponent implements OnInit {
  displayedColumns: string[] = ['empId' ,'USER_NAME', 'EMAIL','CORPORATE_NAME','MOBILE_NUMBER'];
  dataSource: MatTableDataSource<DisplayData>;
  DisplayReipient: DisplayData[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public giftCardDataShow: boolean = true;
  @ViewChild('stepper') stepper;
  @ViewChild('createFirstForm') createFirstForm;
  public selectedIndex = 0;
  checkValidation:boolean=false;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Giftings',
    link: '/search-gifting'
  }
  ];
  forthFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  DigitalCardFormGroup: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  backgroundColor: any;
  textColor: any;
  logoImage='';
  backgroundImage = '';
  textMessage: any;
  headingMessage2: any;
  headingMessage1: any;
  TermsAndcondition=[];
  public statusValue: string = 'Digital';
  CorporateList=[];
  GiftCardList=[];
  CorporateID: any;
  selectedrecipient=[];
  public datashow: boolean = true;
  public datashow1: boolean = false;
  public toggleVal: boolean = true;
  
  public resultsLength;

  // DisplayReipient=[];
   NoRecord: boolean;
   CorporateName: any;
   CurrencyCode: any;
   AmountType='';
   Editable=true;
   Editable1=true;
   Editable2=true;
   public minDate = new Date();
   public maxDate = new Date();
   public maxDateValue;
   DateType: any;
   FixedArray = [];
   minRange=0;
   maxRange=0;
   CardType: any;
   UploadedData=false;
   isSubmitted: boolean;
   selectedphysicalCardPOP=[];
   PopUPData=[];
   selectedphysicalCards = [];
   SelectedQuantity = [];
   DisplayPhysicalReipient: any[];
   CountryCodeList: any;
   CheckCardName = false;
   checkRange = false;
   FileUploadName: string;
   coroprateIdForUpload: any;
  constructor( private http: HttpService,private router: Router, 
    public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder,private uploadFile:UploadFile ) {
    this.toggleVal = true;
    this.buildSearchRangeForm();
  }

  ngOnInit() {
    this.toggleVal = true;
    this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.sort)
    this.getCorporateIDs();
    this.getCardType();
    this.getCountryCodeList();
    
  }
  toggleStatus(event) {
    this.buildFourthGroup();
    if (event.checked == true) {
      this.statusValue = 'Digital';
      this.datashow = true;
      this.datashow1 = false;
      this.checkValidation=false;
    } else {
      this.statusValue = 'Physical';
      this.datashow1 = true;
      this.datashow = false;
      this.DisplayReipient=[];
      this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient)
      this.validationCheck();
    }
  }
  getCorporateIDs() {
    let TempURL = "https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate";
    let data = {
      "searchText":""
    }

    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.CorporateList = (response['Output']);
        console.log(this.CorporateList);
      });
  }
  getGiftCards(value){
  console.log(value); 
  // this.CorporateID = value;
  this.GiftCardList =[];
  this.CorporateID = this.CorporateList[value]['rpOID'];
  let balance = this.CorporateList[value]['balance'];
  this.CorporateName = this.CorporateList[value]['corporateName'];
  let CurrencyCode = this.CorporateList[value]['currencyCode'];
  this.DigitalCardFormGroup.get('balance').patchValue( balance);
  this.DigitalCardFormGroup.get('currencyCode').patchValue( CurrencyCode);

  
 



  let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/get_corporte_gift_card";
  let data = {
    "corporateId":this.CorporateID,
    "languageCode":"en"
  }
  return this.http.postCustomizeJson(TempURL, data)
    .subscribe((response) => {
      console.log(response['Output']);
      this.GiftCardList=response['Output'];
    });
   
  }
  getCardDetails(value){ 
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/get_gift_card_value";
    let data = {
      "giftcardId":value,
      "languageCode":"en"
    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        console.log(response['Output']);
        let Data = response['Output'][0];
        this.getTemplateData(Data['templateId']);
        this.TermsAndcondition = Data['tnc'];   
        console.log(this.TermsAndcondition);
         this.DateType = Data['expiryDateIn'];
        this.maxDateValue =  moment(Data['expiryDate']).format('YYYY-MM-DD');
        this.AmountType = Data['amountType'];
          if(this.DateType=='DATE'){ 
            this.maxDate = this.maxDateValue; 
            console.log(this.maxDate);
          } 
          this.Editable = false;
          // alert(this.AmountType)
          if(this.AmountType == 'FIXED'){
            
            this.FixedArray = Data['fixValue'];
            this.Editable1 = false;
            this.Editable2 = true;
          }else if(this.AmountType == 'BOTH'){
            this.FixedArray = Data['fixValue'];
            this.minRange = Data['minValue'];
            this.maxRange = Data['maxValues'];
            this.Editable1 = false;
            this.Editable2 = false;
          }else{
            this.Editable1=true;
            this.Editable2 = false;
            this.minRange = Data['minValue'];
            this.maxRange = Data['maxValues'];
          }
      
      });
  }
  getTemplateData(val){
    let TempURL = "https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/get_templates_details_by_id";
    let data = {
      "templateId": val,
      "languageCode": "en"
    }
    console.log(data)
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        console.log(response['Output']);
        let Data = response['Output'][0];
        this.backgroundColor=Data['backgroundColor'];
      this.backgroundImage=Data['backgroundImage'];
      this.headingMessage1=Data['headingMessage1'];
      this.headingMessage2=Data['headingMessage2'];
      this.textMessage=Data['textMessage'];
      this.textColor=Data['textColor'];
      this.logoImage=Data['logoImage'];
      });
  }
  public buildSearchRangeForm() {
    this.DigitalCardFormGroup = this.fb.group({
      corporate: ["",Validators.compose([Validators.required])],
      occassionName: ["",Validators.compose([Validators.required])],
      message: [""],
      giftcardId: ["",Validators.compose([Validators.required])],
      // enterValue: [""],
      // presentValue: [""],
      noOfRecipients: ['', Validators.compose([ExtraValidators.conditional(
        group => this.DigitalCardFormGroup.get('toggleVal').value === true,
        Validators.required
        )])],
      balance:['',Validators.compose([Validators.required])],
      toggleVal:[this.toggleVal],
      deliveryDate:['',Validators.compose([Validators.required])],
      currencyCode:['',Validators.compose([Validators.required])],
      cardValue:['',Validators.compose([Validators.required,Validators.pattern("^[1-9][0-9]*")])],
      rangeValue:['',Validators.compose([Validators.pattern("^[1-9][0-9]*")])],
      fixedCardValue:['']
    });
    this.firstFormGroup = this.fb.group({
      CardID: ["", Validators.compose([Validators.required])],
      Quantity: ['', Validators.compose([ExtraValidators.conditional(
        group => this.firstFormGroup.get('rangeUpload').value === 'range',
        Validators.required
        )])],
      // Range: ['', Validators.compose([Validators.required])],
      rangeUpload: ['range', Validators.compose([Validators.required])],
      Range: ['', Validators.compose([ExtraValidators.conditional(
        group => this.firstFormGroup.get('rangeUpload').value === 'range',
        Validators.required
        )])]

    });
    this.secondFormGroup = this.fb.group({
      StartingCardID:['', Validators.compose([Validators.required])],
      EndingCardID:['', Validators.compose([Validators.required])],
      Quantity:['', Validators.compose([Validators.required])],
      Assigned:['', Validators.compose([Validators.required])],
      SelectedQuantity:['', Validators.compose([Validators.required])],
      enterComment: ['', Validators.compose([Validators.required])]
      // StartingCardID:[''],
      // EndingCardID:[''],
      // Quantity:[''],
      // Status:['']

    });
    this.thirdFormGroup = this.fb.group({
      
    });
    this.buildFourthGroup();
  }
  buildFourthGroup(){
    this.forthFormGroup = this.fb.group({
      DisplayPhysicalReipient:this.fb.array([]),
     
    })
  }
  // calling component
  selectRecipient() {

    if(this.CorporateID){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false; 
      const dialogRef = this.dialog.open(
        SelectRecipientDialogComponent,
        {panelClass: 'dialoggiftcardStyleChange'}
      ); dialogRef.componentInstance.CorporateID = this.CorporateID;
      dialogRef.componentInstance.selectedRecipientDetails = this.selectedrecipient;
      dialogRef.afterClosed().subscribe(result => {
        console.log(JSON.stringify(result));
        let recipient=[];
        if (result.buttonName === 'SELECT') {
          this.DisplayReipient=[]
          this.DisplayReipient=result.tableData;
          console.log(this.DisplayReipient)
              this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
          this.displayRecipient();

              for (let i = 0; i < result.tableData.length; i++) {
                console.log(result.tableData);
               
                recipient.push(result.tableData[i]['RP_OID']);
                         }
                       
          }
          // this.dataSource = new MatTableDataSource<DisplayData>(result.tableData);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.selectedrecipient = recipient;
          this.DigitalCardFormGroup.get('noOfRecipients').patchValue( this.selectedrecipient.length);
          console.log(this.DisplayReipient)
          // this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

        });
    }
      }
         
        
     displayRecipient(){
      //  this.dataSource = this.DisplayReipient;
       this.dataSource = new MatTableDataSource(this.DisplayReipient);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
       console.log(this.sort)
       if(this.DisplayReipient.length==0){
         this.NoRecord=true;
       }
      
     }  
     

  

  
  termCondition() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(TermConditionDialogComponent,
      dialogConfig
    ); dialogRef.componentInstance.TNCData = this.TermsAndcondition;
 
    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));



    });
  }





  //   goBackToFirst(stepper: MatStepper) {
  //     if (this.optionsChecked.length == 0) {
  //         this.commError = true;
  //     }
  //     if (this.commError) {
  //         stepper.previous();
  //     }
  //     else {
  //         stepper.next();
  //     }
  // }
  createFirstFormRange(formData) {
    console.log(formData);
    this.giftCardDataShow = false;
  }
  changeStep(index: number) {
    this.stepper.selectedIndex = index;
    console.log(this.stepper.selectedIndex);
  }


  createGiftting(formData){
    if(this.checkRange == false){
    if(this.statusValue=='Digital'){
    console.log(this.coroprateIdForUpload=formData.corporate)
    
    if(this.DigitalCardFormGroup.valid){
    let Objkeys=  {
      "giftingType": this.statusValue,
      "corporateId": this.CorporateID,
      "giftcardId": formData.giftcardId,
       "languageCode": "en",
      "occasionName": formData.occassionName,
      "message": formData.message,
      "cardValue": formData.cardValue,
      "currencyCode": formData.currencyCode, 
      "deliveryDate": moment(formData.deliveryDate).format('YYYY-MM-DD')  ,
      "noOfRecipients": formData.noOfRecipients,
      "recipients": this.selectedrecipient
    }
    console.log(Objkeys);
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_corporate_add"; 
    return this.http.postCustomizeJson(TempURL, Objkeys)
      .subscribe((response) => {
        console.log(response['Output']);
        console.log(response);
        this.router.navigate(["/search-gifting"]);
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Gifting successfully added"
          }
        });
      },
        err => {
          console.log(err)
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 3000,
            data: {
              status: "failure",
              message:  err.error.Error_message[0]
            }
          });


        });
      }
      }else{
        
        if(this.DigitalCardFormGroup.valid){
          let Value =  this.forthFormGroup.value['DisplayPhysicalReipient'];
          console.log(Value)
           let recipientArray=[];
          for(let i=0;i<=Value.length-1;i++){
            let Obj = {
              "giftcardCodeId": Value[i]['giftcardCodeId'],
              "recipientName": Value[i]['RECIPIENT_NAME'],
              "recipientNumber": Value[i]['CountryCode']+'-'+Value[i]['Phone_NUMBER']

            }
            recipientArray.push(Obj)

          }
          console.log(recipientArray)
        let Objkeys= {
          "giftingType": this.statusValue,
          "corporateId": this.CorporateID,
          "giftcardId": formData.giftcardId,
           "languageCode": "en",
          "occasionName": formData.occassionName,
          "message": formData.message,
          "cardValue": formData.cardValue,
          "currencyCode": formData.currencyCode, 
          "deliveryDate": moment(formData.deliveryDate).format('YYYY-MM-DD')  ,
          "noOfRecipients": formData.noOfRecipients,
          // "recipients": this.selectedrecipient,         
          "quantity":this.secondFormGroup.get('Quantity').value, 
          "startingCardId":this.secondFormGroup.get('StartingCardID').value,
          "endingCardId":this.secondFormGroup.get('EndingCardID').value,
          "comment" :this.secondFormGroup.get('enterComment').value,         
          "recipients": recipientArray
          }
    
          console.log(JSON.stringify(Objkeys))
          let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/physical_add";
      
            return this.http.postCustomizeJson(TempURL, Objkeys)
            .subscribe((response) => {
              console.log(response['Output']);
              console.log(response);
              this.router.navigate(["/search-gifting"]);
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: "Gifting successfully added"
                }
              });
            },
              err => {
                console.log(err)
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 3000,
                  data: {
                    status: "failure",
                    message: err.error.Error_message[0]
                  }
                });
      
      
              });
       }
    }
  }
  }
  getCardType() {
    let TempURL = "https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type";
    let data = {}
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.CardType = (response['Output']);
      });
  }
  checkType(val) {
     this.secondFormGroup.reset();
     this.CheckCardName = false;
    if (val == 'range') {
       this.UploadedData = false;
      this.firstFormGroup.get('Range').reset();
      this.firstFormGroup.get('Quantity').reset();
    } 
  }
  getAssigncardDetails(formData,data) {
    this.validationCheck()
    this.buildFourthGroup();
    this.isSubmitted = true;
    this.UploadedData = false;
    console.log(formData);
    
    if(data=='range'){
      this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    if (this.firstFormGroup.invalid && this.checkValidation==true) {
      return false;
    } else { 
      let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_physical_cards_detail";
      let data = {
        "corporateId":this.CorporateID,
        "quantity": formData.Quantity,
        "cardTypeId": formData.CardID,
        "startRange": formData.Range.trim()

      }
      console.log(JSON.stringify(data))
      return this.http.postCustomizeJson(TempURL, data)
        .subscribe((response) => {
          console.log(JSON.stringify(response));
          let data = response['Output'];
          this.SelectedQuantity = [];
          this.selectedphysicalCards = [];
          let status = "Assigned-" + data['availableCount'];
          this.secondFormGroup.get('StartingCardID').patchValue(data['startingCardId']);
          this.secondFormGroup.get('EndingCardID').patchValue(data['endingCardId']);
          this.secondFormGroup.get('Quantity').patchValue(data['Quantity']);
          this.secondFormGroup.get('Assigned').patchValue(status);
          this.secondFormGroup.get('SelectedQuantity').patchValue( data['availableCount']);
          console.log(data['availbleCard']);
          this.selectedphysicalCardPOP=data['availbleCard']
          this.PopUPData = data['availbleCard'];
          // this.forthFormGroup.get('DisplayPhysicalReipient').reset();
          this.displayRecipient1();
          this.Editable = false;
          this.stepper.next();

        },

          err => {
            console.log(err);
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 3000,
              data: {
                status: "failure",
                message: err['error']['Error_message']
              }
            }
            ); this.stepper.previous();
          });
    }
  }
  }
  addGiftCard() {
    this.buildFourthGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    console.log(this.PopUPData);
    let value: any;
    let keyData = this.selectedphysicalCardPOP.length;
    // if(keyData==undefined){
    //   this.selectedphysicalCardPOP=[];
    // }
    if (this.PopUPData.length == this.selectedphysicalCardPOP.length) {
      value = true
    } else {
      value = false
    }
    const dialogRef = this.dialog.open(SelectedstoreDataComponent,
      {panelClass: 'dialoggiftcardStyleChange'}
    ); dialogRef.componentInstance.selectedphysicalCards = this.selectedphysicalCardPOP;
    dialogRef.componentInstance.GiftCardDetails = this.PopUPData;
    dialogRef.componentInstance.selectAll = value;
    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
      if(result['buttonName']=='CANCEL'){
        this.selectedphysicalCardPOP=this.PopUPData;
      }
      else{
      let TempData = result['tableData'];
      this.selectedphysicalCards = [];
      this.selectedphysicalCardPOP = result['tableData'];
      for (let i = 0; i <= TempData.length - 1; i++) {
        let key = TempData[i]['giftcardCodeId'];
        this.selectedphysicalCards.push(key);
      }
      this.secondFormGroup.get('SelectedQuantity').patchValue(this.selectedphysicalCards.length);
      // this.forthFormGroup.get('DisplayPhysicalReipient').reset();
      this.displayRecipient1();
    }
    });
  }



  displayRecipient1(){
     this.forthFormGroup.reset();
    // alert(this.selectedphysicalCardPOP.length)
      const control = <FormArray>this.forthFormGroup.controls['DisplayPhysicalReipient'];
      for (let i = 0; i <= this.selectedphysicalCardPOP.length-1; i++) {
        let indexVal = JSON.stringify(i+1);
       
        let newForm = this.fb.group({
         
            Phone_NUMBER:[''],
            RECIPIENT_NAME:['',Validators.compose([Validators.required])],
            BARCODE:[this.selectedphysicalCardPOP[i]['BARCODE']],
            secretCode:[this.selectedphysicalCardPOP[i]['secretCode']],
            giftcardCodeId:[this.selectedphysicalCardPOP[i]['giftcardCodeId']],
            SL_NO:[indexVal],
            CountryCode:['',Validators.compose([Validators.required])],
            MOBILE_NUMBER:['']
          })
        
        control.push(newForm);
      }
      console.log(this.forthFormGroup.value)

   }
   getCountryCodeList() {
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/recipient/Upload_File/country_details"
    let data = {

    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        console.log(response['countryDetails']);
        this.CountryCodeList = (response['countryDetails']);
      });

  }
  public uploadPhysicalCard(event: FileList, value) {
    this.validationCheck();
    console.log(event);
    console.log(this.CorporateID);
     this.FileUploadName=''
    // alert(value)
    if(this.checkValidation==false){
    if(value!=''){
      this.CheckCardName = false;
    if (event[0].size < 300000) {
      this.secondFormGroup.reset();
              this.thirdFormGroup.reset();
      if ( event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile
          .GiftingAssignPhysicalCardUpload(event.item(0), value,'https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/physical_bulk_upload',this.CorporateID)
          .subscribe(
            response => {
              console.log(JSON.stringify(response));
              this.UploadedData = true;
              this.SelectedQuantity = [];
              this.selectedphysicalCards = [];
              let data = response['Output'];
               
              this.FileUploadName=event[0].name
              let status = "Assigned-" + data['assignedStatusCount'];
              this.secondFormGroup.get('StartingCardID').patchValue(data['startRange']);
              this.secondFormGroup.get('EndingCardID').patchValue(data['endRange']);
              this.secondFormGroup.get('Quantity').patchValue(data['assignedStatusCount']);
              this.secondFormGroup.get('Assigned').patchValue(status);
              this.secondFormGroup.get('SelectedQuantity').patchValue( data['assignedStatusCount']);
              console.log(data['availbleCard']);
              this.selectedphysicalCardPOP=data['availbleCard']
              this.PopUPData = data['availbleCard'];
              // this.forthFormGroup.get('DisplayPhysicalReipient').reset();
              this.displayRecipient1();
              this.Editable = false;
              this.stepper.next();
            },
            err => {
              console.log(err);
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 3000,
                data: {
                  status: "failure",
                  message: err['error']['Error_message']
                }
              }
              );

          this.stepper.previous();
            });

      }else{
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is xls and xlsx"
          }
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
  }else{
    this.CheckCardName = true;
  }
    }
  }

   addPhysicalCards(){
  
     if(this.forthFormGroup.valid){
      this.createGiftting(this.DigitalCardFormGroup.value)
   }
  }
checkAmountType(){
  this.DigitalCardFormGroup.get('fixedCardValue').reset();    
  }
  setCardValue(value){
    this.DigitalCardFormGroup.get('rangeValue').patchValue('');
    this.DigitalCardFormGroup.get('cardValue').patchValue(value);
    this.checkRange = false;
  }
  rangeInput(rangeInput){
    console.log(rangeInput.value);
    this.checkRange = false;
    if(rangeInput.value > this.maxRange){
      this.checkRange = true;
    }else if(rangeInput.value < this.minRange){
      this.checkRange = true;
    }
    this.DigitalCardFormGroup.get('cardValue').patchValue(rangeInput.value);
  }

  validationCheck(){
    if(this.statusValue== 'Physical'){
  if(this.DigitalCardFormGroup.invalid){
       this.checkValidation=true
    }
       else{
        this.checkValidation=false
    }
    }
  
  }
}
