import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.component.html',
  styleUrls: ['./reset-pin.component.scss']
})
export class ResetPinComponent implements OnInit {

  @Input('resetPinErrorMessage') resetPinErrorMessage;
  // @Input('resetPinSuccessMessage') resetPinSuccessMessage;

  public resetErrorMes;
  successMsg: any;
  constructor(private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log(this.resetPinErrorMessage);
    this.getErrorMessage();
    // console.log(this.successMsg);
    // this.successMsg = this.resetPinSuccessMessage;
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }

  getErrorMessage(){
    for (let i = 0; i < this.resetPinErrorMessage.length; i++) {
      this.resetErrorMes = this.resetPinErrorMessage[i].description;
      console.log(this.resetErrorMes);
    }
  }

}
