
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from "src/app/services/uploadFile.service";

@Component({
  selector: 'breads-dialog',
  templateUrl: './breads-dialog.component.html',
  styleUrls: ['./breads-dialog.component.scss']
})
export class BreadsDialogComponent implements OnInit {
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public addonsData = [];
  public addOnType: any;
  list: any;
  public selected;
  public selectedData: any = [];
  public id;

  constructor(private dialogRef: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
    private http: HttpService,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.addOnType = this.data.addonType;
    this.getAddonsData();
  }

  public getAddonsData() {
    this.http.getJson(environment.APIEndpoint + "api/rpa/menu/addon/v1/get/addons?addonType=" + this.addOnType).subscribe(res => {
      this.addonsData = res;
      console.log(this.addonsData);
    })
  }
  // toggleVisibility(event, values){
  //   console.log(event);
  //   // console.log(values);
  //   if(event.checked == true){
  //     console.log(values);
  //     this.selectedData.push(values);
  //     console.log(this.selectedData)
  //   }
  // }
  toggleVisibility(e) {
    console.log(e.target);
  }
  createList() {
    this.list = this.addonsData.filter(e => {
      return e.checked == true
    })
    console.log(this.list);
    this.dialogRef.close(this.list);

  }
  onChange(value: string, isChecked: boolean) {
    console.log(value);
    if (isChecked) {
    } else {

    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}

