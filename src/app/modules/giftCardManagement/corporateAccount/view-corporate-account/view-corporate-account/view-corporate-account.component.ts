import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute } from '@angular/router';
import { CorporateAccountHistoryComponent } from "../../corporate-account-history/corporate-account-history.component";
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
@Component({
  selector: 'view-corporate-account',
  templateUrl: './view-corporate-account.component.html',
  styleUrls: ['./view-corporate-account.component.scss']
})

export class ViewCorporateAccountComponent implements OnInit {
  loadingResponse = true;
  viewCorporateForm:FormGroup;
  public cardDetails;
  statusUpdate: any;
  public historyData;
  panelOpenState = false;
  public toggleVal: boolean = true;
  public rpOID: number;
  public giftCardDetails=[];
  public termCondtn=[]
  public termCondtn_By_new=[]
  public corporateData
  public cardData;
  public langCode=[];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public statusValue: string = 'ONLINE';
  public imagePath :any;
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
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
  constructor(private fb: FormBuilder,public dialog: MatDialog, private http: HttpService, public snackBar: MatSnackBar, private https: HttpService, private activatedRoute: ActivatedRoute, ) {
    this.activatedRoute.params.subscribe((params) => {
      // this.getCorporateId = params['id'];
      this.rpOID = params['id'];
    });
  }
  public txnValue;
  ngOnInit() {
    
    // alert(this.rpOID);
    this.getCorporateId();
    
  }

  public buildForm() {
    let form = {
      termConditionArray: this.fb.array([])
    }
    this.viewCorporateForm = this.fb.group(form);
  }

  public ternConditionFormArray() {
    const controls = <FormArray>this.viewCorporateForm.controls['termConditionArray'];
    
    for (let i = 0; i <  this.langCode[0].length; i++) {
      let control = this.fb.group({
        languageName:  this.langCode[0][i]['languageName'],
        languageCode: this.langCode[0][i]['languageCode'],
        termCondtn: this.langCode[0][i]['termCondtn'],
        termFrom:this.langCode[0][i]['termFrom'],
      });
      controls.push(control);
      console.log(controls);
      
    }
  }

  

  // calling history component

  addHistory(rpOID) {
    const dialogRef = this.dialog.open(CorporateAccountHistoryComponent);
    dialogRef.componentInstance.historyList = this.historyData;
  }
  
// calling added data service
  getCorporateId() {
    let data = {
      "corporateId": this.rpOID,
      "languageCode":"en"
    }
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_By_ID', data).subscribe(res => {
      console.log(res);
      this.loadingResponse = false;
      console.log(JSON.stringify(res));
      this.statusValue =  res['Output']["status"];
      this.toggleVal = res['Output']["status"] == 'ONLINE' ? true : false;
      this.corporateData = res['Output'];
      console.log(this.corporateData.termsAndCondition.length);
      this.historyData = this.corporateData['History'];
      console.log(this.historyData);
      this.termCondtn=this.corporateData['termsAndCondition']
        console.log(this.corporateData['termsAndCondition']);
        this.langCode.push(this.corporateData['termsAndCondition'])
        this.termCondtn_By_new=this.corporateData['termsAndCondition']
       console.log( this.langCode);
       
       this.buildForm();
    // this.getLAnguageList();
    // this.getCardDetails();
    this.ternConditionFormArray();
      
      // this.getCardDetails();
    }, err => {
      console.log(err)
    })
  }

  uploadImage(event){

  }
  statusCall(){
    let data={
      "corporateId":this.rpOID,
      "statusToBe":this.statusValue
      }
  this.http.postCustomizeJson('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/change_status', data).subscribe(res => {
    console.log(res);
   this.statusUpdate= res['Output'];
   this.getCorporateId();
 
   this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 1000,
    data: {
      status: 'success',
      message: this.statusUpdate
    }
  });


}, err => {
  console.log(err)
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 10000,
    data: {
      status: 'failure',
      message: err.error['Error_message']
    }
  });
})
  }
}


