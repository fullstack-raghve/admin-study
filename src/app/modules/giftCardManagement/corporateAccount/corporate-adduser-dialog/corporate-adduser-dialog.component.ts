
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { Globals } from '../../../../../app/services/global';
import { HttpService } from '../../../../services/http-service'
@Component({
  selector: 'app-corporate-adduser-dialog',
  templateUrl: './corporate-adduser-dialog.component.html',
  styleUrls: ['./corporate-adduser-dialog.component.scss']
})
export class CorporateAdduserDialogComponent implements OnInit {
  corporateAddUserDialog: FormGroup;
  formAddUserDataValue;
  closeButton: Boolean = false;
  code:any
  @Input('editUser') editUser: boolean = false;
  @Input('corpotateId') corpotateId;

  editUserUpdate: boolean = false;
public CountryCodeList=[]
  dialCode: any;
  dialcode: any;
  mobileNo: any;
 
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    this.buildCorporateAddUserDialog();

  }

  ngOnInit() {
    console.log(this.editUser);
    this.editUserData();
    this.getCountryCodeList();
  }

  onCloseClick() {
    this.dialogRef.close();

  }

  buildCorporateAddUserDialog() {
    this.corporateAddUserDialog = this.fb.group({
      userName: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*$')])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(50), Validators.pattern(Globals.regEmailVal)])],
      mobileNu: [' ', Validators.compose([Validators.required])],
      userGivenID: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9a-zA-Z"&,.: \"\'? _% -]{1,40}$')])],
      countryCode:['', Validators.compose([Validators.required])],
      country_Code:['',Validators.compose([Validators.required])],
      rpOid:[0],
      cc:[''],
      mobileNumber:[''],
    });
  }
  createCorporateAddUserDialog(formData) {
    console.log(formData);
   console.log(  formData.mmm);
   this.corporateAddUserDialog.controls['mobileNumber'].patchValue(formData.cc+formData.mobileNu.trim())
    this.formAddUserDataValue = formData;
    if (this.corporateAddUserDialog.valid == true && this.corporateAddUserDialog.value) {
      this.corporateAddUserDialog.removeControl('country_Code');
      this.corporateAddUserDialog.removeControl('cc');
      this.corporateAddUserDialog.removeControl('mobileNu');
      this.formAddUserDataValue;
      // this.dialogRef.close();
      this.dialogRef.close(this.corporateAddUserDialog.value);
    }
  }

  editUserData() {
    if (this.editUser == true) {
      this.editUserUpdate = true;
    }
    else {
      this.editUserUpdate = false;
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
  this.corporateAddUserDialog.controls['countryCode'].patchValue(this.code); 
  this.mobileNo=this.CountryCodeList[countryCodeIndex]['dial_code']+ '-' 
  // this.corporateAddUserDialog.controls['mobileNumber'].patchValue(this.mobileNo);
  this.corporateAddUserDialog.controls['cc'].patchValue(this.mobileNo);
}
}
