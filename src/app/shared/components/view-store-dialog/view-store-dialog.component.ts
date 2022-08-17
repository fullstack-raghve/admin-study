import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-view-store-dialog',
  templateUrl: './view-store-dialog.component.html',
  styleUrls: ['./view-store-dialog.component.scss']
})
export class ViewStoreDialogComponent implements OnInit {
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  // displayedColumns: string[] = ['storeId', 'brandName', 'storeName', 'mallName', 'address', 'city', 'country'];
  @Input('selectedStoreData') selectedStoreData = [];
  @Input('selectStoreIdCoupon')selectStoreIdCoupon;
  @Input('selectedStoreIdVal') selectedStoreIdVal=[];
  dataSourceAll;
  storeOidVal: boolean = false;
  noRecords: boolean = false;
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
  public mallList = [];

  ngOnInit() { 
    console.log(this.selectedStoreData);   
    this.selectedStores();
  }

  selectedStores() {
    this.dataSource = new MatTableDataSource(this.selectedStoreData);
    this.dataSourceAll = this.dataSource;
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
