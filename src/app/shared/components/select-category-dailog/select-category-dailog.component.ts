import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-category-dailog',
  templateUrl: './select-category-dailog.component.html',
  styleUrls: ['./select-category-dailog.component.scss']
})
export class SelectCategoryDailogComponent implements OnInit {
  public categoryList: any = [];
  public selectedData: any;
  categoryIdList: any = [];
  contentLoader: boolean = true;
  TempItemList: any;
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
    this.getCategory();
  }

  onCloseClick(): void {
    this.dialogRef.close(this.returnData);
  }

  getCategory() {
    let GET_ALL_CATEGORIES = environment.APIEndpoint + "api/rpa/productcategory/v1/getAllCategories";
    this.https.getJson(GET_ALL_CATEGORIES)
      .subscribe((response) => {
        this.contentLoader = false;
        this.categoryList = response['body'];
        for (let i = 0; i <= this.categoryList.length - 1; i++) {
          if (this.TempItemList != undefined) {
            if (this.categoryList[i]['categoryId'] == this.TempItemList.itemId) {
              this.categoryIdList.push(this.categoryList[i]['categoryId']);
              this.selectedData = this.categoryList[i]
              this.categoryList[i].checked = true;
            }
          }
        }
      })
  }

  toggleVisibility(e, data) {
    if (e.source._checked == true) {
      this.ShowError=false;
      if (!this.categoryIdList.includes(data['categoryId'])) {
        this.categoryIdList.push(data['categoryId']);
        this.selectedData = data
      }
    } else {
      if (this.categoryIdList.includes(data['categoryId'])) {
        let index = this.categoryIdList.indexOf(data['categoryId']);
        this.categoryIdList.splice(index, 1);
        this.selectedData.splice(index, 1);
      }
    }
  }

  createList() {
    if (this.selectedData != undefined) {
      this.returnData = {
        itemId:this.selectedData.categoryId,
        linkToIteamName:this.selectedData.categoryName,
      }
      this.dialogRef.close(this.returnData);
    }else{
      this.ShowError=true;
    }
  }
}
