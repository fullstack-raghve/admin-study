 
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
  BARCODE: string,
  secretCode: string
}

@Component({
  selector: 'app-selectedstore-data',
  templateUrl: './selectedstore-data.component.html',
  styleUrls: ['./selectedstore-data.component.scss']
})
export class SelectedstoreDataComponent  {
  displayedColumns: string[] = ['select','BARCODE', 'secretCode'];
  users: any;
  public paginationData;
  public status = true;
  public selectAll: boolean = true;
  resultsLength: any;

  public PRODUCT: boolean = false;
  @Input('isDisabled') isDisabled: boolean = false;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  GiftCardDetails: GiftCardData[] = [  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  TempateID: any;
  public selection = new SelectionModel(true, []);
  public dataSource: MatTableDataSource<GiftCardData>;
  dataSourceAll: MatTableDataSource<GiftCardData>;
  totalRecordVal: boolean;
  totalFilterRecordVal: boolean;
  noRecords: boolean;
  total: any;
  selectedArray: any[];
  selectedStoreCount: number;
  loadingResponse=true;
  selectedphysicalCards:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SelectedstoreDataComponent>,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar) {

  }
 
  ngOnInit() {
  this.dataSource = new MatTableDataSource<GiftCardData>(this.GiftCardDetails);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.getData();
  }
  getData(){
  this.dataSource = new MatTableDataSource<GiftCardData>(this.GiftCardDetails);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.totalRecordVal = true;
  this.totalFilterRecordVal = true;
  this.loadingResponse=false;
  this.resultsLength = this.GiftCardDetails.length;
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


 if (this.selectAll) {
    for (let i of this.dataSource.data) {
      this.selection.select(i);
    }
  }else   if (this.GiftCardDetails.length > 0) {
    // console.log(this.GiftCardDetails.length);
    // this.SKU_CODE = this.GiftCardDetails[0]
 
    for (let i of this.dataSource.data) {
      if (this.GiftCardDetails.indexOf(i['giftcardCodeId']) > -1) {
        this.selection.select(i);
      }
    }
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
