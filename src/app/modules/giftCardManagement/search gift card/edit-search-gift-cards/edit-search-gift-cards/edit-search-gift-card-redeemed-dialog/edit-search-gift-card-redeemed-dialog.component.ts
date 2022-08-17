import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../../services/http-service';
import { VALID } from '@angular/forms/src/model';
@Component({
  selector: 'app-edit-search-gift-card-redeemed-dialog',
  templateUrl: './edit-search-gift-card-redeemed-dialog.component.html',
  styleUrls: ['./edit-search-gift-card-redeemed-dialog.component.scss']
})
export class EditSearchGiftCardRedeemedDialogComponent implements OnInit {
  @Input('redeemedList') redeemedList = [];

  reedemedFormGroup: FormGroup;
  redeemedFormData;
  storeDetails=[]
  storeOid: any;
  storeId;
  cashierDetails=[]
  constructor(private https: HttpService, public dialog: MatDialog, private fb: FormBuilder, private dialogRef: MatDialogRef<EditSearchGiftCardRedeemedDialogComponent>) { }

  ngOnInit() {
    this.buildReedemedForm()
    this.redeemedList
    console.log(JSON.stringify(this.redeemedList));
    this.stroreData()
   

  }
  onClickClose() {
    this.dialogRef.close();
  }
  buildReedemedForm() {
    this.reedemedFormGroup = this.fb.group({
      // storeName: ['', Validators.compose([Validators.required,])],
      cashierId: ['', Validators.compose([Validators.required,])],
      tId: ['', Validators.compose([Validators.required,])],
      sId: ['', Validators.compose([Validators.required,])],


    });
  }

  createredeemedForm(formData) {
    console.log(formData);
    this.redeemedFormData = formData;
    // if ( formData.sId == 'VALID' && formData.tId == 'VALID' && formData.cashierId== 'VALID' && this.reedemedFormGroup.value!='') 
    if(this.reedemedFormGroup.invalid){
      console.log();
      
    }
    else
    {
      this.redeemedFormData;
      // this.dialogRef.close();
      this.dialogRef.close(this.reedemedFormGroup.value);
    }
  }

  cardDetails(v) {

    let obj = {
      'buttonName': 'SELECT',
      'cardData': this.reedemedFormGroup.value,
      'storeOid':this.storeOid
    }

    let formData = this.reedemedFormGroup.value
    if ( this.reedemedFormGroup.valid==true) {
      this.dialogRef.close(obj);
    }
   
   
  }

  stroreData() {
    let data = {
      "languageCode": "en"
    }
    this.https.postJson1('https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_stores', data).subscribe(res => {
      console.log(res['Output']);
      console.log(JSON.stringify(res['Output']));
      this.storeDetails=res['Output']
     
      

    })
  }
 storeData(storeDetail){
    console.log(storeDetail);
      this.storeOid=this.storeDetails[storeDetail]['STORE_OID']
      this.storeId=this.storeDetails[storeDetail]['STORE_ID']
     console.log( this.storeOid);
     let data=
  {
   "storeOid":this.storeOid
  } 
  this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/get_store_user', data).subscribe(res => {
    console.log(res['Output']);
    console.log(JSON.stringify(res['Output']));
    this.cashierDetails=res['Output']
    console.log(this.cashierDetails);
    
   
    

  })

  }
  onCloseClick() {
    this.dialogRef.close();

  }
}