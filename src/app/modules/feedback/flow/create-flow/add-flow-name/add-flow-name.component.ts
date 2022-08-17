import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-flow-name',
  templateUrl: './add-flow-name.component.html',
  styleUrls: ['./add-flow-name.component.scss']
})
export class AddFlowNameComponent implements OnInit {
  flowName;
  ngModelValue;
  currentIndex;
  changeFlowName: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddFlowNameComponent>, private fb: FormBuilder) {
    console.log(data)
  }

  ngOnInit() {
    this.currentIndex = this.data.index;
    this.ngModelValue = this.data['allData'][this.currentIndex].pageName;
    this.createForm();

  }

  public createForm() {
    const form = {
      flowName: [this.ngModelValue, Validators.required],
    };
    this.changeFlowName = this.fb.group(form);
  }
  changeName(value) {
    console.log(value)
    if (this.changeFlowName.invalid) {

    } else {
      this.dialogRef.close({
        index: this.currentIndex,
        value: this.changeFlowName.get('flowName').value
      });
    }

  }
  onCloseClick() {
    this.dialogRef.close();
  }
}
