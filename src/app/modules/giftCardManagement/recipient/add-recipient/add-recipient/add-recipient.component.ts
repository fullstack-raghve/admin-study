
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.scss']
})

export class AddRecipientComponent implements OnInit {
  addRecipientForm: FormGroup;
  corporateDetails = [];
  searchData=[];
  mobileNo: string;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private dialogRef: MatDialogRef<MatDialog>,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.buildAddRecipientForm();
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getCorporateId()
    this.getCountryCodeList();
  }
  CountryCodeList=[]
  public buildAddRecipientForm() {
    this.addRecipientForm = this.fb.group({
      id: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9]+$")])],
      name: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ]*$")])],
      emailId: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(50), Validators.pattern(Globals.regEmailVal)])],
      phoneNumber: ['', Validators.compose([Validators.required,Validators.pattern('^[1-9][0-9]*')])],
      corporateName: ['', Validators.compose([Validators.required])],
      CountryCode: ['', Validators.compose([Validators.required])],
      CountryCodeNo:['']
     });
  }
  // addind recipient list
  createRecipientForm(formData) {
    console.log(formData);
    if(this.addRecipientForm.invalid){
      console.log(this.addRecipientForm);
      
    }
    else{
      let data = {

        "languageCode": 'en',
        "corporateId": formData.corporateName,
        "fullName": formData.name,
        "phoneNumber": formData.CountryCode + '-' + formData.phoneNumber,
        "Email": formData.emailId,
        "countryCode": ' ',
        "empId": formData.id
  
  
      }
      console.log(JSON.stringify(data));
      this.https.postJson1('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/add_and_update_recipients', data).subscribe(res => {
        console.log(res);
        
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1000,
          data: {
            status: 'success',
            message: 'Recipient List has been Added successfully'
          }
        });
        this.dialogRef.close();
        window.location.reload();
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

  // corporate id 

  getCorporateId() {
    let data = {
      "searchText":""
    }
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate', data).subscribe(res => {
      console.log(res);
      this.corporateDetails = res['Output'];
      console.log(this.corporateDetails);


    });
  }
  onCloseClick() {
    this.dialogRef.close();
  }

  getSearchdata(){
    let data={

    }
    this.https.postJson1('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/get_recipients_user', data).subscribe(res => {
      console.log(res);
      this.searchData = res['Output'];
      console.log(this.searchData);
    });
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

  codeData(countryCodeIndex){; 
    
    let mn= countryCodeIndex;
    this.addRecipientForm.controls['CountryCodeNo'].patchValue(mn+ '-' );
  }
}

