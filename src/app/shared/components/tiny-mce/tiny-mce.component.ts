import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tiny-mce',
  templateUrl: './tiny-mce.component.html',
  styleUrls: ['./tiny-mce.component.scss']
})
export class TinyMceComponent implements OnInit {
public ngModelValue;
public showerrors = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<TinyMceComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.ngModelValue = this.data
  }

  addDes(value, form:NgForm){
    if(form.invalid){
      this.showerrors = true;
    }
    else{
      this.dialogRef.close(value);
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
