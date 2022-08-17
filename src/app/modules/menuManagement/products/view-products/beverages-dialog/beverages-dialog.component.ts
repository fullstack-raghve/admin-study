import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// import { StoreDialog } from "../store-dialog/store-dialog.component";
import { UploadFile } from "src/app/services/uploadFile.service";


@Component({
  selector: 'beverages-dialog',
  templateUrl: './beverages-dialog.component.html',
  styleUrls: ['./beverages-dialog.component.scss']
})
export class BeveragesDialogComponent implements OnInit {
	public addOnName;
  public imgUploadDesserts = false;
  public imagePathDesserts = '';
  public showError = false;
  public showImageError = false;
  public viewData = [];
  public id;
  price;
  constructor(private dialogRef: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
      private http: HttpService,
      private uploadFile: UploadFile,
      public snackBar: MatSnackBar,
      private router: Router,) {
    dialogRef.disableClose = true;

   
  }

  ngOnInit() {
  }

  getViewData(){
    this.id = this.router.url.split('view-products/')[1];
    let data={
      "productOid" : parseFloat(this.id)
    }
      this.http.postJson(environment.APIEndpoint+"api/rpa/product/v1/view", data).subscribe(res=>{
                 this.viewData=res;
                 this.imgUploadDesserts = true;
      
      })
}
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

