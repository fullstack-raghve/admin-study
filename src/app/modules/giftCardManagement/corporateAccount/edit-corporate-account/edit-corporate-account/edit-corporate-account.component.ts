import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from '../../../../../../../src/app/services/uploadFile.service';
import { SelectedGiftCardComponent } from "../../selected-gift-card/selected-gift-card.component";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { CorporateAdduserDialogComponent } from "../../corporate-adduser-dialog/corporate-adduser-dialog.component";
import { CorporateAdddeductDialogComponent } from "../../corporate-adddeduct-dialog/corporate-adddeduct-dialog.component";
import { CorporateAccountHistoryComponent } from "../../corporate-account-history/corporate-account-history.component";
import { CorporateAccountDeductDialogComponent } from "../../corporate-account-deduct-dialog/corporate-account-deduct-dialog.component"
import{EditHistoryDialogComponent} from "../../edit-corporate-account/edit-history-dialog/edit-history-dialog.component"
import { Globals } from '../../../../../../../src/app/services/global';
import { group } from '@angular/animations';
@Component({
  selector: 'edit-corporate-account',
  templateUrl: './edit-corporate-account.component.html',
  styleUrls: ['./edit-corporate-account.component.scss']
})
export class EditCorporateAccountComponent implements OnInit {
  loadingResponse = true;
  giftCardObj=[];
  termConditionView=[];
  prePopulatedData :boolean=false;
  public alignCss = [];
  public selectGiftCardDialogData: any = [];
  public rightPanel = [];
  public editcorporateFormGroup: FormGroup;
  public viewCorporaterTermCon = [];
  public buildFlag: boolean = false;
  selectedUser = [];
  selectedUserId = [];
  viewCorporateData = []
  public langCode;
  public viewCorporateId;
  selectedCount: number;
  storeErrorMsg: string;
  statusValue:string;
  public imagePath: string = '';
  public imageUploading: boolean = false;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public showImageError: boolean = false;
  public imgUpload = false;
  public imgPathUrl = localStorage.getItem("imgBaseUrl");
  public toggleVal: boolean = true;
  currencyValue: [];
  currencyAmount: [];
  deductCurrencyValue: [];
  deducturrencyAmount: [];
  giftCardDataView = [];
  popupgiftCardData=[];
  giftCardId
  logo
  viewHistoryList=[]
  public addUserDialogData: any = [];
  public addUserData: any = [];
  public viewCorporaterpOid;
  public termsConditionError: boolean = false;
  public addMoreData: boolean = false;
  public addUserDataView;
  public newArray = [];
  public giftCardDetails: any = [];
  public newAddedUsers = [];
  public giftErrorMsg=false;
  public contactsErrorMsg=false;
  public viewHistoryData;
  editUser: boolean = true;
  GiftCardID=[]
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  BALANCE: any;
  historyRpoid: any;
  currencyValueView: any;
  constructor(private fb: FormBuilder, private http: HttpService, private https: HttpService,
    private router: Router, private uploadFile: UploadFile, private changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) {
    this.activatedRoute.params.subscribe((params) => {
      // this.getCorporateId = params['id'];
      this.viewCorporateId = params['id'];
    });

  }

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    // link: '/view-client-on-boarding'
  },
  {
    title: 'Corporate account',
    link: ''
  }
  ];

  ngOnInit() {
    this.getViewData();

  }
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
      
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
  removeGiftcard(rowIndex: number) {
    this.giftCardDataView.splice(rowIndex, 1)
    this.selectGiftCardDialogData.splice(rowIndex, 1)
  }
  // get view data service
  getViewData() {


    let data = {
      "corporateId": this.viewCorporateId,
      "languageCode": "en"
    }
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_By_ID', data).subscribe(res => {
      console.log(JSON.stringify(res));
      this.viewCorporateData = res['Output'];
      this.loadingResponse = false;
      this.buildEditFormGroup(this.viewCorporateData);
      console.log( this.viewCorporateData);
      console.log(this.viewCorporateData['logo']);
      this.historyRpoid=this.viewCorporateData['rpOid']
      this.imagePath = this.viewCorporateData['logo']
      this.currencyValueView=this.viewCorporateData['currencyCode']
      this.viewHistoryList= this.viewCorporateData['History']
      this.statusValue = this.viewCorporateData['status'];
      this.toggleVal = res['Output']["status"] == 'ONLINE' ? true : false;
      this.addUserDataView = res['Output']['addUsers'];
      console.log(this.addUserDataView);
      this.giftCardDataView = res['Output']['giftCards'];
      for(let i=0;i<this.giftCardDataView.length;i++){

        this.GiftCardID.push(this.giftCardDataView[i]['giftcardId']);
      }
      console.log(this.giftCardDataView);
      this.viewCorporaterpOid = this.viewCorporateData['rpOid'];
      this.viewCorporaterTermCon = this.viewCorporateData['termsAndCondition'];
     this.viewHistoryData= this.viewCorporateData['History'];
     for(let i=0;i<this.viewHistoryData.length;i++){
       this.BALANCE=this.viewHistoryData[i].BALANCE
       console.log(this.BALANCE);
       
     }
     this.termsConditionFormArray();
     this.addUserArrayMethod();
    }, err => {
      console.log(err)
    })

  }

  // to see view data
  buildEditFormGroup(editData) {
    if(editData.addUsers!=""){
      this.prePopulatedData=true;
      console.log( this.prePopulatedData);
      
    }
    console.log(editData.rpOid);
    if (editData.rpOid == undefined) {
      this.buildFlag = false;
      let form = {
        imagePath: '',
        name: '',
        userName: '',
        email:'',
        mobile:'',
        corporateName: ['', Validators.compose([Validators.required, Validators.pattern(Globals.regCustomwhiteList)])],
        contactName: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*$')])],
        contactMobileNumber: [''],
        contactEmailId: ['', Validators.required, Validators.compose([Validators.minLength(7), Validators.minLength(50), Validators.pattern(Globals.regEmailVal)])],
        // termsCondition: ['', Validators.required,],
        termsConditionArray: this.fb.array([]),
        addUserArrayMethod:this.fb.array([]),
      }
      this.editcorporateFormGroup = this.fb.group(form);
    }

    else {
      this.buildFlag = true;
      console.log(editData);
      this.editcorporateFormGroup = this.fb.group({
        corporateName: [editData.corporateName,Validators.compose([Validators.required,Validators.pattern(Globals.regAlbhanumericVal)])],
       imagePath: editData.imagePath,
        name: '',
        userName: '',
        email:'',
        mobile:'',
        contactName: [editData.contactName,Validators.compose([Validators.required,Validators.pattern(Globals.regAlbhanumericVal)])],
        contactMobileNumber: [editData.mobileNumber],
        contactEmailId: [editData.email,Validators.compose([Validators.required,Validators.pattern(Globals.regEmailVal)])],
        termsConditionArray: this.fb.array([]),
        addUserArrayMethod:this.fb.array([]),
      });
    }
  }
  public termsConditionFormArray() {
    const control = <FormArray>this.editcorporateFormGroup.controls['termsConditionArray'];
    let TempArr = [];

    // }
    for (let i=0;i<this.viewCorporaterTermCon.length;i++) {
      let newForm = this.fb.group({
       
        termsAndCondition: this.viewCorporaterTermCon[i]['termCondtn'],
        // languageName:this.viewCorporaterTermCon[i][' languageName'],
        languageCodeForTerm: this.viewCorporaterTermCon[i]['languageCode'],
        termsAndConditionOid: this.viewCorporaterTermCon[i]['rpOid'],
        languageName:this.viewCorporaterTermCon[i]['languageName'],
         termFrom:this.viewCorporaterTermCon[i]['termFrom'],
                        });
      console.log(newForm);

      control.push(newForm);

    }
    console.log(this.editcorporateFormGroup)
  }

// add User Array start
public addUserArrayMethod() {
  const control = <FormArray>this.editcorporateFormGroup.controls['addUserArrayMethod'];
  let TempArr = [];

console.log(this.addUserDataView);
  for (let i=0;i<this.addUserDataView.length;i++) {
    let newForm = this.fb.group({

      userName:[this.addUserDataView[i]['userName'],Validators.compose([Validators.required,Validators.pattern('[a-zA-Z ]*$')])],
      email: [this.addUserDataView[i]['email'],Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(50), Validators.pattern(Globals.regEmailVal)])],
      mobileNumber: this.addUserDataView[i]['mobileNumber'],
      userGivenID:[this.addUserDataView[i]['userGivenID'], Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z"&,.: \"\'? _% -]{1,40}$')])],
      rpOid: this.addUserDataView[i]['rpOid'],
      status:this.addUserDataView[i]['status'],
      countryCode:this.addUserDataView[i]['countryCode'],
              });
    console.log(newForm);

    control.push(newForm);

  }
 
  console.log(this.editcorporateFormGroup)
}

// add User Array end

  // data update
  editCorporateForm(formData) {
    
    console.log(this.currencyValue);
    
    if(this.imagePath==''){
      this.showImageError=true;
     }
     if (this.giftCardObj.length == 0 &&  this.giftCardDataView.length == 0){
      this.giftErrorMsg = true;
    }
    else{
      this.giftErrorMsg = false;
    }
    if (formData.addUserArrayMethod.length == 0){
      this.contactsErrorMsg = true;
    }
    console.log(formData);
    // giftcard
    this.giftCardDataView
    // let giftCardObj=[]
    this.giftCardObj=[];
   for(let i=0;i<this.giftCardDataView.length;i++){
    let keyObj ={
      giftCard: this.giftCardDataView[i]['giftcardId'],
      status: this.statusValue
    }
    this.giftCardObj.push(keyObj)
   }
    let data = {
      "corporateId": this.viewCorporaterpOid,
      "logo": this.imagePath,
      "corporateName": formData.corporateName,
      "currencyCode":  this.currencyValueView,
      "contactName": formData.contactName,
      "mobileNumber": formData.contactMobileNumber,
      "email": formData.contactEmailId,
      // "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
       "status": this.statusValue,
      "termsAndCondition": formData.termsConditionArray,
      "addUsers": formData.addUserArrayMethod,
      "giftCards": this.giftCardObj,
      "newAmounts": [
        {

          "addAmt": this.currencyAmount? this.currencyAmount : '0' ,
          "deductAmt": this.deducturrencyAmount? this.deducturrencyAmount : '0' ,
          "currencyCode": this.currencyValue==undefined? this.currencyValueView:this.currencyValue,
          "status": "ONLINE",
          "approveStatus": "SEND FOR APPROVAL"
        }
      ]
    }
    console.log(JSON.stringify(data));
    if(this.editcorporateFormGroup.valid && (this.giftErrorMsg==false) &&(this.contactsErrorMsg==false) ){
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/update_corporate_account', data).subscribe(res => {
      console.log(res);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: 'Updated successfully'
        }
      });
      if(res){
        this.router.navigate(['/search-corporate-account']);
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
  public removeImage(index) {
    this.imagePath = "";
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
      this.GiftCardID=[];
      this.giftCardDataView=[];
      console.log(data.tableData);

      for (let i = 0; i < data.tableData.length; i++) {
        console.log(data.tableData[i]);
        // this.popupgiftCardData.push(data.tableData[i]);
        this.giftCardDataView.push(data.tableData[i]);
        this.GiftCardID.push(data.tableData[i]['giftcardId'])
      }
    });
  }
  addUserDialog() {
    const dialogRef = this.dialog.open(CorporateAdduserDialogComponent
      ,  {panelClass: 'addUsermodelSize'});
    dialogRef.componentInstance.editUser = this.editUser;
    dialogRef.componentInstance.corpotateId = this.viewCorporateId;
    //  binding child component value to parent component
    dialogRef.afterClosed().subscribe(data => {
      this.contactsErrorMsg = false;
      console.log(data);
      let OBJ1 ;
      this.addUserDataView=[];
      if(data){
        OBJ1 = data;
        OBJ1['status']=this.statusValue;
        this.addUserDataView.push(OBJ1);
      }
      console.log(this.addUserDataView);
      this.addUserArrayMethod();
    });
  }
  addDecuctDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      CorporateAdddeductDialogComponent,
      {panelClass: 'modelSize'}
    );
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      let addDeductDialogData = data;
      this.currencyValue = addDeductDialogData.currency['currencyCode'];
      this.currencyAmount = addDeductDialogData.amount;
      console.log(this.currencyValue);
      console.log(this.currencyAmount);


    });
  }
  // addHistory() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = false;
  //   const dialogRef = this.dialog.open(
  //     CorporateAccountHistoryComponent,
  //     dialogConfig
  //   );
  // }
   editHistory(value){
    const dialogRef = this.dialog.open(EditHistoryDialogComponent,  {panelClass: 'HistrymodelSize'});
    dialogRef.componentInstance.historyList = this.viewHistoryList;
    dialogRef.componentInstance.corporateRpoId = this.historyRpoid;
   }
  decuctDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      CorporateAccountDeductDialogComponent,
      {panelClass: 'modelSize'}
    );
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      let deductDialogData = data;
      // this.deductCurrencyValue = deductDialogData.currency;
      this.deducturrencyAmount = deductDialogData.amount;
      // console.log(this.deductCurrencyValue);
      // console.log(this.deducturrencyAmount);


    });
  }

  expandDataEmail() {
    var allifram = document.getElementById("arabicID");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
  expandtermAndCondition() {
    var allifram = document.getElementById("arabicIDtac");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
  // end component calling

  onClickDelete(rowIndex) {

    var index = (this.editcorporateFormGroup.controls['addUserArrayMethod']['controls']).indexOf(rowIndex);
    if (index !== -1) (this.editcorporateFormGroup.controls['addUserArrayMethod']['controls']).splice(index, 1)


    var ary1_index = (this.editcorporateFormGroup.controls['addUserArrayMethod'].value).indexOf(rowIndex.value);
    if (ary1_index !== -1) (this.editcorporateFormGroup.controls['addUserArrayMethod'].value).splice(ary1_index, 1)
   // this.addUserArrayMethod();
   let r=[];
           r.push(rowIndex);
          // this.editcorporateFormGroup.controls['addUserArrayMethod']['controls'].splice(r,1)
    
  }

  onClickEdit(i){
    this.addUserDataView.reset(i);
    this.addUserDialogData.reset(i)
  }
  addDecuctDialog1(){

  }

}
