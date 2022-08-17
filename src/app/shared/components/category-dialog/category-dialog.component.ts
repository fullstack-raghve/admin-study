import { OnInit, ViewChild, Input, Component, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonFunctions } from 'src/app/services/common-functions';
import { Common } from 'src/app//services/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  @ViewChild('categoryInput') categoryInput: ElementRef;
  @Input('prepopulateCategories') prepopulateCategories;
  @Input('couponDateRange') couponDateRange: any;
  @Input('mode') mode : string;

  public loadingResponse: boolean = false;
  public categoriesData: any = [];
  public list: any = [];
  public categoryIds: any = [];
  public categoryTempArr = [];
  public categoryError: boolean = false;

  constructor(private fb: FormBuilder,
    private commonFunctions: CommonFunctions,
    private common: Common,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.searchCategories();
  }

  searchCategories() {
    this.loadingResponse = true;
    let data = {
      "page": "0",
      "pageSize": 500,
      "order": { "column": "oid", "dir": "asc" },
      "keySearch": this.categoryInput.nativeElement.value,
      "mode": this.mode,
      "fieldSearch": [
        { "fieldName": "couponStartDate", "fieldValue": this.couponDateRange.startDate },
        { "fieldName": "couponEndDate", "fieldValue": this.couponDateRange.endDate },
        { "fieldName": "status", "fieldValue": "ONLINE" }
      ]
    }
    this.common.getCategoriesForCoupon(data).subscribe((response) => {
      this.categoriesData = response['items'];
      this.loadingResponse = false;
    }, error => {
      this.commonFunctions.displayErrorMessage(error);
      this.loadingResponse = false;
    })
    this.categoryTempArr = this.categoryTempArr.concat(this.prepopulateCategories);
    if (this.prepopulateCategories != undefined) {
      this.categoryIds = this.prepopulateCategories.map(item => item.categoryId);
    }
  }

  clearSearch() {
    this.categoryInput.nativeElement.value = '';
    this.searchCategories();
  }
  addCategories() {
    if(this.categoryTempArr.length > 0){
      this.categoryError = false;
      console.log(this.list);
      this.list = this.categoryTempArr;
      this.dialogRef.close(this.list);
    }else{
      this.categoryError = true;
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onCategorySelect(event, item) {
    if (event.checked) {
      this.categoryError = false;
      this.categoryTempArr.push(item);
    } else if (!event.checked) {
      this.categoryTempArr.forEach((element, index) => {
        if (element.categoryId == item.categoryId) {
          this.categoryTempArr.splice(index, 1);
        }
      });
    }
  }

}
