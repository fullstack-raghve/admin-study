import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from "src/app/services/uploadFile.service";
import { StoreDialogComponent } from "../store-dialog/store-dialog.component";

@Component({
  selector: 'addOns-dialog',
  templateUrl: './addOns-dialog.component.html',
  styleUrls: ['./addOns-dialog.component.scss']
})

export class AddOnsComponent implements OnInit {
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public addonsData = [];
  public addOnType: any;
  list: any;
  public selected;
  public selectedData: any = [];
  public  categoryOid;
  // @Input('viewData') viewData = [];
  // @Input('viewDataDetails') viewDataDetails = [];


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
    console.log(this.addOnType);
    this.getAddonsData();
    // console.log(this.viewData);
    // console.log(this.viewDataDetails);
  }

  public getAddonsData() {
    let TempURL; 
    if(this.addOnType != 'CUSTOMISATION'){
       TempURL = environment.APIEndpoint + "api/rpa/menu/addon/v1/get/addons?addonType=" + this.addOnType;
    }else{
      TempURL = environment.APIEndpoint + "api/rpa/menu/addon/v1/get/addonsByCategory?addonType=" + this.addOnType+"&categoryOid="+this.categoryOid;
    }
    // TempURL = environment.APIEndpoint + "api/rpa/menu/addon/v1/get/addons?addonType=" + this.addOnType;
    this.http.getJson(TempURL).subscribe(res => {
      let addonsData = res;
      console.log(this.addonsData);
      for(let i=0;i<=addonsData.length-1;i++){
        
        this.addonsData[i]=addonsData[i];
        if(this.selectedData.includes(this.addonsData[i]['addonOid'])){
          this.addonsData[i].checked=true;
          // this.addonsData[i]['isSelected']=true;
        }else{
          this.addonsData[i].checked=false;
          // this.addonsData[i]['isSelected']=false;
        }
        
      }
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
    // if (this.addOnType = "CUSTOMISATION") {
    //   this.viewDataDetails = [];
    //   for (let i = 0; i < this.viewDataDetails.length; i++) {
    //     console.log(this.viewDataDetails[i].addonOid);
    //     console.log(this.addonsData[i].addonOid);
    //     if (this.viewDataDetails[i].addonOid == this.addonsData[i].addonOid) {
    //       alert("Yes equal");
    //     }
    //     else {
    //       this.list = this.addonsData.filter(e => {
    //         return e.checked == true
    //       })
    //       this.dialogRef.close(this.list);
    //       console.log(this.list);
    //     }
    //   }
    // }
    // else {
    //   if (this.addOnType = "ADDON") {
    //     this.list = this.addonsData.filter(e => {
    //       return e.checked == true
    //     })
    //     this.dialogRef.close(this.list);
    //     console.log(this.list);
    //   }
    // }

    this.list = this.addonsData.filter(e => {
      return e.checked == true
    })
    this.dialogRef.close(this.list);
    console.log(this.list);
  }

  onCloseClick(): void {
    this.list = this.addonsData.filter(e => {
      return e.checked == true
    })
    this.dialogRef.close();
  }
}

