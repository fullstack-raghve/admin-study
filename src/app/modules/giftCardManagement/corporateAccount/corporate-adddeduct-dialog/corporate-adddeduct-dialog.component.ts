import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-corporate-adddeduct-dialog',
  templateUrl: './corporate-adddeduct-dialog.component.html',
  styleUrls: ['./corporate-adddeduct-dialog.component.scss']
})
export class CorporateAdddeductDialogComponent implements OnInit {
  corporateAddDialogForm: FormGroup;

  public currencies:any=[];
  public formDataValue;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;

    this.buildcorporateAddDialogForm();
  }

  ngOnInit() {
    this.getAllCurrencies();
  }

  onCloseClick() {
    
    this.dialogRef.close();


  }
  buildcorporateAddDialogForm() {
    this.corporateAddDialogForm = this.fb.group({
      currency: ['', Validators.compose([Validators.required])],
      amount: ['', Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
    });
  }

  selectedAddDialog = {
    currency: "",
    amount: ""
  };

  selectedAdd(flow) {
    console.log(flow);

  }


  createCorporateAddDialogForm(formData) {
    console.log(formData);
    this.formDataValue = formData;
    if(this.corporateAddDialogForm.valid==true){
      this.formDataValue;
      this.dialogRef.close(this.corporateAddDialogForm.value);
    }
    
    // if (this.formDataValue){
    //   const dialogRef = this.dialog.closeAll();
    //   this.dialogRef.close();

    // }
  }
  public getAllCurrencies(){
    let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
    .subscribe((response) => {
        this.currencies=response;
        console.log(this.currencies);
        
    })
}
}
