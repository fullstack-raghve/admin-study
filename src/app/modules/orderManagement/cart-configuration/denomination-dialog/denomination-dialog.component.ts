import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../services/http-service';
import { environment } from 'src/environments/environment';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface Keyword {
  name: string;
}
@Component({
  selector: 'denomination-dialog',
  templateUrl: './denomination-dialog.component.html',
  styleUrls: ['./denomination-dialog.component.scss']
})

export class DenominationDialog implements OnInit {

  corporateAddDialogForm: FormGroup;

  public currencies:any=[];
  public formDataValue;
  public keywordArray = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedCountry=[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordErrorMsg: any;
  requiredKeywordError: any;
  keywordEmptyErrors: any;
  selectedData=[];
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;

    this.buildcorporateAddDialogForm();
  }
  ngOnInit() {
    this.currencies = this.selectedCountry;
  }

  onCloseClick() {
    
    this.dialogRef.close();


  }
  checkCurrencyCode(data){
    this.keywordArray=[]
    for(let i=0;i<=this.selectedData.length-1;i++){
        if(data == this.selectedData[i]['currencyCode']){
            for(let j=0;j<=this.selectedData[i]['keyNumber'].length-1;j++){
              let key = this.selectedData[i]['keyNumber'][j].key;
              if(!this.keywordArray.includes(key)){
                this.keywordArray.push(key)
              }
              // this.keywordArray.push(this.selectedData[i]['keyNumber'][j].key)
            }
        }
    }
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




  createCorporateAddDialogForm(formData) {
    
    this.formDataValue = formData;
    if(this.corporateAddDialogForm.get('currency').value != '' && this.keywordArray.length >0){
      let value = {
        currency:formData.currency,
        keyNumbers:this.keywordArray
      }
     
      this.dialogRef.close(value);
    }
    

  }

ErrorMessage=''
addKeyword(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;  
  if (value!= undefined && value != '') {

    if(this.keywordArray.length>=10){
      this.keywordErrorMsg = true;
      input.value = '';
      this.ErrorMessage='Allowed only 10 Inputs';
      setTimeout(() => {

        this.ErrorMessage='';
        this.keywordErrorMsg = false;
    }, 2000);
  }else{
    this.keywordErrorMsg= true;
  
      if(this.keywordArray.includes(value)){
        input.value = '';
        this.ErrorMessage="Duplicate amount can't be added";
        setTimeout(() => {
        
          this.ErrorMessage='';
          this.keywordErrorMsg = false;
      }, 2000);

      }else{
        this.keywordArray.push(value);
        // this.requiredKeywordError = false;
      this.keywordErrorMsg = false;
      this.ErrorMessage='';
      input.value = '';
      }
      
    }
   
  

  }  else{
    this.keywordErrorMsg = true;
    this.ErrorMessage="Please enter Amount";
    input.value = '';
    setTimeout(() => {
     
      this.keywordErrorMsg = false;
      this.ErrorMessage='';
  }, 2000);
  }
    
}
removeKeyword(keyword: Keyword): void {
  const index = this.keywordArray.indexOf(keyword);

  if (index >= 0) {
    this.keywordArray.splice(index, 1);
  }
}

}
