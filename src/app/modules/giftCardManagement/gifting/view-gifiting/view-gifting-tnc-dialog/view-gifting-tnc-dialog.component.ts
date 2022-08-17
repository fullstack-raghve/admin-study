import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../../services/http-service'
@Component({
  selector: 'app-view-gifting-tnc-dialog',
  templateUrl: './view-gifting-tnc-dialog.component.html',
  styleUrls: ['./view-gifting-tnc-dialog.component.scss']
})
export class ViewGiftingTncDialogComponent implements OnInit {
  @Input('tncData') tncData = [];
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    
   }
public viewGiftingTncDialog:FormGroup;
  ngOnInit() {
    console.log(this.tncData);
    this.buildForm();
    this.ternConditionFormArray();
  }
  public buildForm() {
    let form = {
      termConditionArray: this.fb.array([])
    }
    this.viewGiftingTncDialog = this.fb.group(form);
  }
  public ternConditionFormArray() {
    const controls = <FormArray>this.viewGiftingTncDialog.controls['termConditionArray'];
    
    for (let i = 0; i <  this.tncData.length; i++) {
      let control = this.fb.group({
        languageName:  this.tncData[i]['languageName'],
        languageCode: this.tncData[i]['languageCode'],
        terms: this.tncData[i]['terms'],
      });
      controls.push(control);
      console.log(controls);
      
    }
  }
  
  onCloseClick() {
    this.dialogRef.close();
  }
}
