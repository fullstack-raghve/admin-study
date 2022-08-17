import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatButtonToggleModule} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { SelectRecipientDialogComponent } from '../../add-gifting/select-recipient-dialog/select-recipient-dialog.component';
import {MatStepperModule} from '@angular/material/stepper';
import { TermConditionDialogComponent } from '../../term-condition-dialog/term-condition-dialog.component';
import * as moment from 'moment';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { SelectedstoreDataComponent } from "../../../assign-physical-cards/selectedstore-data/selectedstore-data.component";
import { UploadFile } from '../../../../../services/uploadFile.service';
import { MatStepper } from '@angular/material/stepper';
import { ExtraValidators } from 'src/app/services/validator-service';
import { ActivatedRoute } from '@angular/router';
import { getDropData } from 'ngx-drag-drop/dnd-utils';

export interface DisplayData {
  Corporate_name: string;
  empId: number;
  USER_NAME: number;
  EMAIL: string;
  Phone_NUMBER: string 
}
@Component({
  selector: 'app-edit-gifting',
  templateUrl: './edit-gifting.component.html',
  styleUrls: ['./edit-gifting.component.scss']
})
export class EditGiftingComponent implements OnInit {

  displayedColumns: string[] = ['empId' ,'USER_NAME', 'EMAIL','CORPORATE_NAME','MOBILE_NUMBER'];
  dataSource: MatTableDataSource<DisplayData>;
  DisplayReipient: DisplayData[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public giftCardDataShow: boolean = true;
  @ViewChild('stepper') stepper;
  @ViewChild('createFirstForm') createFirstForm;
  public selectedIndex = 0;
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
  viewGiftingId: any;
  viewData: any;
  checkRange = false;
  
  constructor( private http: HttpService,private router: Router, 
    public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder,private uploadFile:UploadFile, private activatedRoute: ActivatedRoute, ) {
 
   
    this.buildSearchRangeForm();
    this.activatedRoute.params.subscribe((params) => {
      this.viewGiftingId = params['id'];
      console.log(this.viewGiftingId);

    });
  }

  ngOnInit() {
   
    // this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    console.log(this.sort)
    
    this.getCardType();
    this.getCountryCodeList();
    this.getViewData();
  }
  public buildSearchRangeForm() {
    this.DigitalCardFormGroup = this.fb.group({
      corporate: ["",Validators.compose([Validators.required])],
      occassionName: ["",Validators.compose([Validators.required])],
      message: [""],
      giftcardId: ["",Validators.compose([Validators.required])],
      giftcardName:['',Validators.compose([Validators.required])],
      // enterValue: [""],
      // presentValue: [""],
      noOfRecipients: ['', Validators.compose([ExtraValidators.conditional(
        group => this.DigitalCardFormGroup.get('toggleVal').value === true,
        Validators.required
        )])],
      balance: ["",Validators.compose([Validators.required])],
      toggleVal:[this.toggleVal],
      deliveryDate:['',Validators.compose([Validators.required])],
      currencyCode:['',Validators.compose([Validators.required])],
      cardValue:['',Validators.compose([Validators.required,Validators.pattern("^[1-9][0-9]*")])],
      rangeValue:['',Validators.compose([Validators.pattern("^[1-9][0-9]*")])],
      fixedCardValue:['']
    });
    // this.firstFormGroup = this.fb.group({
    //   CardID: ["", Validators.compose([Validators.required])],
    //   Quantity: ['', Validators.compose([ExtraValidators.conditional(
    //     group => this.firstFormGroup.get('rangeUpload').value === 'range',
    //     Validators.required
    //     )])],
      
    //   rangeUpload: ['', Validators.compose([Validators.required])],
    //   Range: ['', Validators.compose([ExtraValidators.conditional(
    //     group => this.firstFormGroup.get('rangeUpload').value === 'range',
    //     Validators.required
    //     )])]

    // });
    // this.secondFormGroup = this.fb.group({
    //   StartingCardID:['', Validators.compose([Validators.required])],
    //   EndingCardID:['', Validators.compose([Validators.required])],
    //   Quantity:['', Validators.compose([Validators.required])],
    //   Assigned:['', Validators.compose([Validators.required])],
    //   SelectedQuantity:['', Validators.compose([Validators.required])],
    //   enterComment: ['', Validators.compose([Validators.required])]

    // });
    // this.thirdFormGroup = this.fb.group({
      
    // });
    // this.buildFourthGroup();
  }
  getViewData(){
    let data={
      "languageCode": "en",
      "giftingId": this.viewGiftingId
      }
   this.http.postCustomizeJson('https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_corporate_selected_view', data)
   .subscribe(res => {
     console.log(res);
     console.log(JSON.stringify(res));
      this.viewData = res['Output'][0];
      this.DigitalCardFormGroup.get('rangeValue').patchValue(this.viewData['value'].split('.')[0]);
      this.DigitalCardFormGroup.get('corporate').patchValue(this.viewData['corporateName']);
      this.DigitalCardFormGroup.get('occassionName').patchValue(this.viewData['occasionName']);
      this.DigitalCardFormGroup.get('message').patchValue(this.viewData['message']);
      this.CorporateID=this.viewData['corporateId'];
      this.getBalance();
      if(this.viewData['giftingType']=='DIGITAL'){
        this.statusValue = 'Digital';
        this.DigitalCardFormGroup.get('toggleVal').patchValue('true');
      }else{
        this.statusValue = 'Physical';
        this.DigitalCardFormGroup.get('toggleVal').patchValue('false');
      }
      this.DigitalCardFormGroup.get('deliveryDate').patchValue(this.viewData['deliveryDate']);
      this.DigitalCardFormGroup.get('currencyCode').patchValue(this.viewData['curencyCode']);
      let currencyvalue = this.viewData['value'];
      
      this.DigitalCardFormGroup.get('cardValue').patchValue(currencyvalue.split('.')[0]);
      this.DigitalCardFormGroup.get('giftcardName').patchValue(this.viewData['giftcardName']);
      this.DigitalCardFormGroup.get('giftcardId').patchValue(this.viewData['giftcardId']);
      this.getCardDetails(this.viewData['giftcardId']);
       this.DigitalCardFormGroup.get('noOfRecipients').patchValue(this.viewData['noOfRecipients']);
       this.selectedrecipient=[]
     
       for(let i=0;i<=this.viewData['recipients'].length-1;i++){
         let key = this.viewData['recipients'][i]['RP_OID'];
         this.selectedrecipient.push(key);
       }
       this.DisplayReipient=[]
       this.DisplayReipient=this.viewData['recipients'];
       console.log(this.DisplayReipient)
           this.dataSource = new MatTableDataSource<DisplayData>(this.viewData['recipients']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
       this.displayRecipient();
          
      // toggleVal:[this.toggleVal], ee selectedrecipient
     
  }
   );
}
  toggleStatus(event) {
    // this.buildFourthGroup();
    if (event.checked == true) {
      this.statusValue = 'Digital';
      this.datashow = true;
      this.datashow1 = false;
  
    } else {
      this.statusValue = 'Physical';
      // this.datashow1 = true;
      this.router.navigate(["/search-gifting"]);
      this.datashow = false;
      this.DisplayReipient=[];
      // this.dataSource = new MatTableDataSource<DisplayData>(this.DisplayReipient)
    }
  }
  getBalance() {
    let TempURL = "https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_By_ID_Details";
    let data = {
      "corporateId": this.CorporateID,
      "languageCode":"en"
    }

    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        let key = (response['Output']['balance']);
        this.DigitalCardFormGroup.get('balance').patchValue(key);
        
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
          if(this.AmountType == 'FIXED'){
            
            this.FixedArray = Data['fixValue']
            this.Editable1 = false;
            this.Editable2 = true;
           
          }else if(this.AmountType == 'BOTH'){
            this.Editable1 = false;
            this.Editable2 = false;
            this.FixedArray = Data['fixValue'];
            this.maxRange = Data['maxValues'];
            this.minRange = Data['minValue'];
          }else{
            this.Editable1=true;
            this.Editable2 = false;
            this.maxRange = Data['maxValues'];
            this.minRange = Data['minValue'];
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

  // buildFourthGroup(){
  //   this.forthFormGroup = this.fb.group({
  //     DisplayPhysicalReipient:this.fb.array([]),
     
  //   })
  // }
  // calling component
  selectRecipient() {

    if(this.CorporateID){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false; 
      const dialogRef = this.dialog.open(
        SelectRecipientDialogComponent,
        dialogConfig  
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
          this.selectedrecipient = recipient;
          this.DigitalCardFormGroup.get('noOfRecipients').patchValue( this.selectedrecipient.length);
          console.log(this.DisplayReipient);
        });
    }
      }
               
     displayRecipient(){
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

  createFirstFormRange(formData) {
    console.log(formData);
    this.giftCardDataShow = false;
  }
  changeStep(index: number) {
    this.stepper.selectedIndex = index;
    console.log(this.stepper.selectedIndex);
  }
  // setCardValue(value){
  //   this.DigitalCardFormGroup.get('cardValue').patchValue(value);

  // }

  updateGiftting(formData){
    if(this.checkRange == false){
    if(this.statusValue=='Digital'){
    console.log(formData)
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
      "recipients": this.selectedrecipient,
      "giftingId" : this.viewGiftingId
    }
    console.log(Objkeys);
    if(this.DigitalCardFormGroup.valid){
      console.log(JSON.stringify(Objkeys))
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_corporate_digital_edit"; 
    return this.http.postCustomizeJson(TempURL, Objkeys)
      .subscribe((response) => {
        console.log(response['Output']);
        console.log(response);
        this.router.navigate(["/search-gifting"]);
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Gifting successfully updated"
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
    if (val == 'range') {
       this.UploadedData = false;
      this.firstFormGroup.get('Range').reset();
      this.firstFormGroup.get('Quantity').reset();
    } 
  }
  getAssigncardDetails(formData,data) {
    // this.buildFourthGroup();
    this.isSubmitted = true;
    this.UploadedData = false;
    console.log(formData);
    
    if(data=='range'){
      this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
    if (this.firstFormGroup.invalid) {
      return false;
    } else { 
      let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_physical_cards_detail";
      let data = {
        "corporateId":this.CorporateID,
        "quantity": formData.Quantity,
        "cardTypeId": formData.CardID,
        "startRange": formData.Range

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
    // this.buildFourthGroup();
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
      dialogConfig
    ); dialogRef.componentInstance.selectedphysicalCards = this.selectedphysicalCardPOP;
    dialogRef.componentInstance.GiftCardDetails = this.PopUPData;
    dialogRef.componentInstance.selectAll = value;
    dialogRef.afterClosed().subscribe(result => {
      console.log(JSON.stringify(result));
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
    });
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

  displayRecipient1(){
     this.forthFormGroup.reset();
    // alert(this.selectedphysicalCardPOP.length)
      const control = <FormArray>this.forthFormGroup.controls['DisplayPhysicalReipient'];
      for (let i = 0; i <= this.selectedphysicalCardPOP.length-1; i++) {
        let indexVal = JSON.stringify(i+1);
       
        let newForm = this.fb.group({
         
            Phone_NUMBER:[''],
            RECIPIENT_NAME:[''],
            BARCODE:[this.selectedphysicalCardPOP[i]['BARCODE']],
            secretCode:[this.selectedphysicalCardPOP[i]['secretCode']],
            giftcardCodeId:[this.selectedphysicalCardPOP[i]['giftcardCodeId']],
            SL_NO:[indexVal],
            CountryCode:[''],
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
    console.log(event)
    if (event[0].size < 300000) {
      this.secondFormGroup.reset();
              this.thirdFormGroup.reset();
      if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile
          .GiftingAssignPhysicalCardUpload(event.item(0), value,'https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/physical_bulk_upload',this.CorporateID)
          .subscribe(
            response => {
              console.log(JSON.stringify(response));
              this.UploadedData = true;
              this.SelectedQuantity = [];
              this.selectedphysicalCards = [];
              let data = response['Output'];
          
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

   addPhysicalCards(){
  
     if(this.forthFormGroup.valid){
      this.updateGiftting(this.DigitalCardFormGroup.value)
   }
  }
  checkAmountType(){
    this.DigitalCardFormGroup.get('fixedCardValue').reset();    
    }
}

