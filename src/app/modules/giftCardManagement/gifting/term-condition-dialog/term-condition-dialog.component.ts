import { Component, OnInit,Inject, Input} from '@angular/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
@Component({
  selector: 'app-term-condition-dialog',
  templateUrl: './term-condition-dialog.component.html',
  styleUrls: ['./term-condition-dialog.component.scss']
})
export class TermConditionDialogComponent implements OnInit {
  panelOpenState = false;
  languageName: boolean;
  constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<TermConditionDialogComponent>,
  private dialog: MatDialog,
  private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private http: HttpService,
  public snackBar: MatSnackBar) { }
  TNCFormGroup : FormGroup;
  // TNCData=[];

  @Input('TNCData') TNCData = [];

  // @Input('storeList') storeList = [];
  ngOnInit() {
    console.log(this.TNCData)
    this.buildGiftCardForm();
  }
  buildGiftCardForm() {

    this.TNCFormGroup = this.fb.group({
      conditionArray: this.fb.array([]),
    })
    this.setData();
  }
  setData(){
    const control = <FormArray>this.TNCFormGroup.controls['conditionArray'];
    for (let i = 0; i < this.TNCData.length; i++) {
      let newForm = this.fb.group({
        languageName: this.TNCData[i]['languageName'],
        terms: this.TNCData[i]['terms']
      });
      control.push(newForm);
    }
    this.languageName = this.TNCFormGroup['controls']['conditionArray']['controls']
}
expandtermAndCondition() {
  var allifram = document.getElementById("arabicIDtac");
  var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
  var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
  html_Arabic.setAttribute("style", "direction: rtl;");
}
}
