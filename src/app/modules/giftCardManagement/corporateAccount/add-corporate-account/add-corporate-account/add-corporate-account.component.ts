import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { environment } from '../../../../../../environments/environment'
import { Globals } from '../../../../../../../src/app/services/global';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from '../../../../../../../src/app/services/uploadFile.service';
import { SelectedGiftCardComponent } from "../../selected-gift-card/selected-gift-card.component";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { CorporateAdduserDialogComponent } from "../../corporate-adduser-dialog/corporate-adduser-dialog.component";
import { CorporateAdddeductDialogComponent } from "../../corporate-adddeduct-dialog/corporate-adddeduct-dialog.component";
import { CorporateAccountHistoryComponent } from "../../corporate-account-history/corporate-account-history.component";
@Component({
  selector: 'add-corporate-account',
  templateUrl: './add-corporate-account.component.html',
  styleUrls: ['./add-corporate-account.component.scss']
})
export class AddCorporateAccountComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Corporate Account',
    link: '/search-corporate-account'
  }
  ];
  giftCardId;
  GiftCardID=[];
  public giftCardDetails:any=[];
  public termCondition
  public addUserData: any = [];
  balance: boolean = true;
  public rightPanel = [];
  alignCss = [];
  public selectGiftData: any = [];
  panelOpenState = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public langCode;
  public termsCon
  public termsConditionError = false;
  public giftFormGroup: FormGroup;
  selectedUser = [];
  selectedUserId = [];
  selectedCount: number;
  storeErrorMsg: string;
  selectedAmountValue;
  public statusValue: string = 'ONLINE';
  public imagePath: string = '';
  public imageUploading: boolean = false;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public showImageError: boolean = false;
  public imgUpload = false;
  public imgPathUrl = localStorage.getItem("imgBaseUrl");
  public toggleVal: boolean = true;
  addDeductDialogData: any = [];
  public contactsErrorMsg = false;
  public balanceErrorMsg=false;
  public giftErrorMsg=false;
  // addUserDialogData = [];
  currencyValue: [];
  currencyAmount: [];
  corporate_Name :any =[];
  searchDeatails=[];
  public addUserDialogData: any = [];
  addUserDialogData1: {};
  name: [];
  email: [];
  mobile: [];
  userName: [];
  public newAddedUsers = [];
  newgiftCardDetails=[];
  CountryCodeList=[]
  public selectGiftCardDialogData: any = [];
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
   dialcode: any;
  code:any;
   mobileNo:  string;
  balanceAmt: string;
  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, private uploadFile: UploadFile, private changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private https: HttpService,
    public dialog: MatDialog) {

    this.buildCorporateFormGroup();
  }
  corporateFormGroup: FormGroup;
  ngOnInit() {
    this.termsConditionFormArray();
    this.getCountryCodeList()
    // this.getSearchData()
  }
  onCloseClick(i){
    this.addUserDialogData.splice(i,1)
    
  }

  buildCorporateFormGroup() {
    this.corporateFormGroup = this.fb.group({
      corporateImage: [""],
      corporateName: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.pattern(Globals.regCustomwhiteList)])],
      contactName: ['', Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]*$')])],
      emailid: ['', Validators.compose([Validators.required,Validators.pattern(Globals.regEmailVal)])],
      ContactNumber: ['',Validators.compose([Validators.required])],

      termsCondition: [''],
      termsConditionArray: this.fb.array([]),
      addUserDialogData:this.fb.array([]),
      // balanceAmt:['',Validators.compose([Validators.required])],
      CountryCode:['',Validators.compose([Validators.required])],
      cc:['',Validators.compose([Validators.required])],
      mobileno:['']
    });

  }
  public refresh() {
    this.corporateFormGroup.reset()
  }
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
      
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
  // term nd condition block
  public termsConditionFormArray() {
    const control = <FormArray>this.corporateFormGroup.controls['termsConditionArray'];
    for (let i=0;i<this.languageList.length;i++) {
      console.log(this.languageList[i]['languageId']);
      this.langCode = this.languageList[i]['languageId']
      console.log(this.langCode);
      let newForm = this.fb.group({
        languageCodeForTerm: this.languageList[i]['languageCode'],
        termsAndCondition: [''],
        "termFrom": "Corporate"
      });
      console.log(newForm);

      control.push(newForm);
      this.alignCss.push(this.languageList[i]['direction'] == 'RTL' ? 'text-right' : '');
      this.rightPanel.push(this.languageList[i]['direction'] == 'RTL' ? 'right-panel' : '');
    }
  }
  removeTermsCondErrorMsg(index) {
    let totalLength = this.languageList.length;
    if (totalLength - 1 == index) {
      console.log("length = " + index);
      this.termsConditionError = false;
    }
  }
  expandtermAndCondition() {
    var allifram = document.getElementById("arabicIDtac");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
  // term nd condition block ends
  public uploadImage(event: FileList) {
    if (event[0].size < 1000000) {

        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
          || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
          this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
      this.imageUploading = true;
      let new_file = new File([this.imagePath], 'new Date()');
              console.log(new_file);
      this.uploadFile.upload1(event.item(0), event[0].type)
        .subscribe((response) => {
          console.log(response['Saved Location']);
          this.imagePath = response['Saved Location'];
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElRef.nativeElement.value = ''
          console.log(this.imagePath);

          console.log("res ::: " + response)
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: " image successfully uploaded"
            }
          });


        }, err => {

          console.log("error Status = " + err);
          if (err.error.errorType == 'VALIDATION') {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Supported format is JPG, JPEG and PNG"
              }
            });
          } 

        }
        )
      }
      else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } 
    
    
    else {

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }

  }

  public removeImage(index) {
    this.imagePath! = "";

  }
  // component calling methods

  addGiftCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
    SelectedGiftCardComponent,
    dialogConfig
    );
    dialogRef.componentInstance.ImageList =this.GiftCardID
    dialogRef.afterClosed().subscribe(data => {
      this.giftErrorMsg = false;
      this.giftCardDetails=[];
      this.GiftCardID=[];
    console.log(data.tableData);
    this.selectGiftCardDialogData.push(data);
    for(let i=0;i<data.tableData.length;i++)
    {
    console.log(data.tableData[i]);
    this.giftCardDetails.push(data.tableData[i]);
    this.GiftCardID.push(data.tableData[i]['giftcardId'])
    }
    });
    }
    
  addUserDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      CorporateAdduserDialogComponent,
      {panelClass: 'addUsermodelSize'}
    );
    //  binding child component value to parent component
    dialogRef.afterClosed().subscribe(data => {
    {
      this.contactsErrorMsg = false;
        console.log(data);
        if(data.value!=""){
          this.addUserDialogData.push(data);
        }
       
      }
     // console.log(this.addUserDialogData[0].name);
      for (var i = 0; i < this.addUserDialogData.length; i++) {
        this.addUserData = this.addUserDialogData[i];
        console.log(this.addUserDialogData[i].name);

      }
    });
  }

  addDecuctDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      CorporateAdddeductDialogComponent,
      {panelClass: 'modelSize'}
    );
    //  binding child component value to parent component
    dialogRef.afterClosed().subscribe(data => {
      this.balanceErrorMsg = false;
      console.log(data);
       this.addDeductDialogData = data;
      this.currencyValue = this.addDeductDialogData.currency.currencyCode;
      this.currencyAmount = this.addDeductDialogData.amount;
      console.log(this.currencyValue);
      console.log(this.currencyAmount);
       this.balanceAmt=this.currencyAmount +' '+ this.currencyValue
      console.log(this.balanceAmt);
      
    });
  }

  addHistory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      CorporateAccountHistoryComponent,
      dialogConfig
    );
  }
  public conditionFormArray() {
    const control = <FormArray>this.giftFormGroup.controls['conditionArray'];
    for (let i = 0; i < this.languageList.length; i++) {
      this.langCode = this.languageList.languageCode[i];
      console.log(this.langCode);
      let newForm = this.fb.group({
        description: [''],
      });
      control.push(newForm);
    }
  }

  addcorporateForm(formData) {
    this.corporateFormGroup.controls['mobileno'].patchValue(formData.cc+formData.ContactNumber.trim())
    console.log(this.corporateFormGroup.controls['mobileno'].value);
    
    console.log(this.corporateFormGroup);
    console.log(formData);
    if (this.addUserDialogData.length == 0){
      this.contactsErrorMsg = true;
    }
    if (this.giftCardDetails.length == 0){
      this.giftErrorMsg = true;
    }
    if (this.addDeductDialogData.length == 0){
      this.balanceErrorMsg = true;
    }
   if(this.imagePath==''){
    this.showImageError=true;
   }
   
    let termsError;
    for (let d of formData.termsConditionArray) {
      this.termCondition = d.termsCondition
      console.log(this.termCondition);

      if (d.termsCondition == '') {
        termsError = true;
      }
    }
    
    this.termsConditionError = false;
    this.newAddedUsers=[]
    for (let i = 0; i < this.addUserDialogData.length; i++) {
     this.newAddedUsers.push(
        {
          "userName": this.addUserDialogData[i].userName,
          "mobileNumber": this.addUserDialogData[i].mobileNumber,
          "email": this.addUserDialogData[i].email,
          "countryCode": this.addUserDialogData[i].countryCode,
          "userGivenID": this.addUserDialogData[i].userGivenID,
          "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
        }
        )
    }
   this.newgiftCardDetails=[];
   for (let i = 0; i < this.giftCardDetails.length; i++) {
     this.newgiftCardDetails.push(
       {
            "giftCard":   this.giftCardDetails[i].giftcardId,
            "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
       }
     )
      }
   

    let data = {
      "logo": this.imagePath,
      "corporateName": formData.corporateName,
      "currencyCode": this.currencyValue,
      "contactName": formData.contactName,
      "mobileNumber": this.corporateFormGroup.controls['mobileno'].value,
      "email": formData.emailid,
      "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
      "termsAndCondition":formData.termsConditionArray,
      "giftCards":  this.newgiftCardDetails,
    
      "addUsers": this.newAddedUsers,
      "amounts": [
        {

          "addAmt": this.currencyAmount,
          "deductAmt": 0,
          "currencyCode": this.currencyValue,
          "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
          "approveStatus": "SEND FOR APPROVAL"
        }

      ]
    }
    console.log(JSON.stringify(data));
    if(this.corporateFormGroup.valid &&(this.giftErrorMsg==false) &&(this.contactsErrorMsg == false) &&(this.balanceErrorMsg==false) &&(this.showImageError==false)){
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/create_corporate_account', data).subscribe(res => {
      console.log(res);
      let val = res['Output'];
      if(val){
        this.router.navigate(['/search-corporate-account']);
      }

      if(val=='corporate Name can not be duplicate'){
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: 'failure',
            message: 'corporate Name can not be duplicate'
          }
        });
      }
    else{
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: 'Corporate Account has been Added successfully'
        }
      });
    }
      
    },
      (error) => {    
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: 'failure',
            message: error.error['Error_message'][0]
          }
        });
      }
    );
    }
  }
  getCountryCodeList() {
    let TempURL = "https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/recipient/Upload_File/country_details"
    let data = {

    }
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        console.log(response['countryDetails']);
        this.CountryCodeList = (response['countryDetails']);
        console.log(JSON.stringify( this.CountryCodeList));
      });

  }
  codeData(countryCodeIndex){
    console.log(countryCodeIndex);
    this.code=this.CountryCodeList[countryCodeIndex]['code']
    this.dialcode=this.CountryCodeList[countryCodeIndex]['dial_code']
    console.log(this.code);
    // this.corporateFormGroup.controls['CountryCode'].patchValue(this.code); 
    this.mobileNo= this.CountryCodeList[countryCodeIndex]['dial_code']+ '-' 
    // this.corporateFormGroup.controls['mobileno'].patchValue(this.mobileNo);
    this.corporateFormGroup.controls['cc'].patchValue(this.mobileNo);
    
  }

}
