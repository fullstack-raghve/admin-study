 
    import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
    import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
    import { FormBuilder, FormGroup } from '@angular/forms';
    import { ActivatedRoute } from '@angular/router';
    import { HttpService } from '../../../../services/http-service';
    // import { environment } from 'src/environments/environment';
    // import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
    import { BehaviorSubject } from 'rxjs';
    import { SelectionModel } from '@angular/cdk/collections';
    // import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
    import {MatPaginator} from '@angular/material/paginator';
    export interface GiftCardData {
      productId: number,
      SKU_CODE: string,
      PRODUCT_NAME: string
    }

@Component({
  selector: 'app-sku-dialog',
  templateUrl: './sku-dialog.component.html',
  styleUrls: ['./sku-dialog.component.scss']
})
export class SkuDialogComponent implements OnInit {
  @Input('selectedValue') selectedValue;
  users: any;
  public searchUserForm: FormGroup;
  public paginationData;
  public status = true;
  public selectAll: boolean = false;
  resultsLength: any;
  displayedColumns: string[] = ['select', 'SKU_CODE', 'PRODUCT_NAME'];
  public PRODUCT: boolean = false;
  @Input('isDisabled') isDisabled: boolean = false;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  SKU_Product: GiftCardData[] = [  ];
  public dataSource: MatTableDataSource<GiftCardData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  TempateID: any;
  public selection = new SelectionModel(true, []);
  dataSourceAll: MatTableDataSource<GiftCardData>;
  noRecords=false;
  total: any;
  loadingResponse: boolean = true;
  SkuList:any;
  public totalRecordVal: boolean = false;
  totalFilterRecordVal: boolean = true;
  totalCount:any;
  selectedArray: any[];
  selectedStoreCount: number;
  SKU_CODE: any;
  productId: any;
    // dataSource = this.GiftCardData;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SkuDialogComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    
    // console.log(this.selectedValue)
    this.PRODUCT = this.selectedValue;
    if(this.selectedValue=='PRODUCT'){
      this.SKU_CODE = this.SkuList[0];
       this.SkuList='';
    }
      
    this. getData();
    this.dataSource = new MatTableDataSource<GiftCardData>(this.SKU_Product);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  getData(){
   
let TEMPURL = 'https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/prdouct_sku';
let data = {
  languageCode: "EN"
}

return this.http.postCustomizeJson(TEMPURL, data)
  .subscribe((response) => {
    // console.log(response)
    this.dataSource = response['Output'];
    let notification_data = response['Output'];
    // console.log(notification_data);
    this.loadingResponse = false;
      this.dataSource = new MatTableDataSource<GiftCardData>(notification_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalRecordVal = true;
      this.totalFilterRecordVal = true;
      this.resultsLength = response["Output"].length;
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.total = this.resultsLength;
      // console.log(this.total);

      if (this.total == 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      
  
        if(this.selectedValue=='AMOUNT'){
          if (this.SkuList.length > 0) {
            // console.log(this.SkuList.length);
    
            for (let i of this.dataSource.data) {
              if (this.SkuList.indexOf(i["SKU_CODE"]) > -1) {
                this.selection.select(i);
              }
            }
          } else if (this.selectAll) {
            for (let i of this.dataSource.data) {
              this.selection.select(i);
            }
          }
        }else{
            
          if (this.SkuList.length > 0) {
            // console.log(this.SkuList.length);
            // this.SKU_CODE = this.SkuList[0]
            for (let i of this.dataSource.data) {
              if (this.SkuList.indexOf(i["SKU_CODE"]) > -1) {
                this.selection.select(i);
              }
            }
          } else if (this.selectAll) {
            for (let i of this.dataSource.data) {
              this.selection.select(i);
            }
          }
        }

 

    }, err => {
      // console.log(err);
      this.loadingResponse = true;
    // })
  }); 
  }



  isSelected(value: any): boolean {
      if (value.productId == this.productId){
      return true;
      }
    else{
      return false;
      }
    
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
}
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedArray = this.selection.selected;
    this.selectedStoreCount = this.selectedArray.length;
    return numSelected === numRows;
}



}


