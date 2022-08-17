
import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { StoreDialogComponent } from '../store-dialog/store-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'view-store-dialog',
  templateUrl: './view-store-dialog.component.html',
  styleUrls: ['./view-store-dialog.component.scss']
})

export class ViewVariantStoreDialogComponent implements OnInit {
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['storeId', 'storeName', 'country', 'currency', 'extraColumns'];
  @Input('selectedStoreData') selectedStoreData = [];
  @Input('variantsStorePopupDataEdit') variantsStorePopupDataEdit = [];
  // @Input('variantsDataView') variantsDataView = [];
  // @Input('variantsName') variantsName = [];
  // @Input('variantRegionArray') variantRegionArray = [];
  @Input('variantsData') variantsData = [];
  @Input('totalCount') totalCount = [];
  @Input('storeList') storeList = [];
  dataSourceAll;
  storeOidVal: boolean = false;
  noRecords: boolean = false;
  storeCount: any[];
  selectStoreVal: boolean;
  dataStore: boolean;
  storeRequiredFiled: boolean;
  storeErrorMsg: string;
  selectedVaraintsData: any;
  loadingResponse: boolean;
  totalRecordVal: boolean;
  totalFilterRecordVal: boolean;
  resultsLength: any;
  total: any;
  disabledTable: boolean;
  selectAll: any;
  paginationData: any;
  variantsStoreData: any;

  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar,
    private http: HttpService) {
    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
  }

  public selection = new SelectionModel(true, []);

  ngOnInit() {
    console.log(this.selectedStoreData);
    // console.log(this.variantsStorePopupDataEdit);
    // console.log(this.variantsDataView);
    // console.log(this.variantsName);
    // console.log(this.variantRegionArray);
    // console.log(this.variantsData);
    this.selectedStores();
  }

  selectedStores() {
    this.dataSource = new MatTableDataSource(this.selectedStoreData);
    this.dataSourceAll = this.dataSource;
    console.log(this.dataSourceAll);
    this.dialogRef.disableClose = false;
  }

  onCloseClick() {
    this.dialogRef.close();
  }

}
