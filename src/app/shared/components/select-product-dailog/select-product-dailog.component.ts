import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-product-dailog',
  templateUrl: './select-product-dailog.component.html',
  styleUrls: ['./select-product-dailog.component.scss']
})
export class SelectProductDailogComponent implements OnInit {
  public productList: any = [];
  public selectedData: any;
  productIdList: any = [];
  contentLoader: boolean = true;
  TempItemList: any;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public returnData : any;
  public ShowError : boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MatDialog>,
    private https: HttpService,
    public snackBar: MatSnackBar,
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getAllProducts();
  }

  onCloseClick(): void {
    this.dialogRef.close(this.returnData);
  }

  getAllProducts() {
    let GET_ALL_CATEGORIES = environment.APIEndpoint + "api/rpa/product/v1/getAllProducts";
    this.https.getJson(GET_ALL_CATEGORIES)
      .subscribe((response) => {
        this.contentLoader = false;
        this.productList = response['body'];
        for (let i = 0; i <= this.productList.length - 1; i++) {
          if (this.TempItemList != undefined) {
            if (this.productList[i]['productOid'] == this.TempItemList.itemId) {
              this.productIdList.push(this.productList[i]['productOid']);
              this.selectedData = this.productList[i]
              this.productList[i].checked = true;
            }
          }
        }
      })
  }

  toggleVisibility(e, data) {
    if (e.source._checked == true) {
      this.ShowError=false;
      if (!this.productIdList.includes(data['productOid'])) {
        this.productIdList.push(data['productOid']);
        this.selectedData = data
      }
    } else {
      if (this.productIdList.includes(data['productOid'])) {
        let index = this.productIdList.indexOf(data['productOid']);
        this.productIdList.splice(index, 1);
        this.selectedData.splice(index, 1);
      }
    }
  }

  createList() {
    if (this.selectedData != undefined) {
      this.returnData = {
        itemId: this.selectedData.productOid,
        linkToIteamName: this.selectedData.productName,
      }
      this.dialogRef.close(this.returnData);
    }else{
      this.ShowError=true;
    }
  }
}

