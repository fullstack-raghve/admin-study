import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
export interface TxnData {
  srNo: number;
  walletName: string;
  currency: string;
  minimumBalance: string;
  maximumBalance: string;
  maximumSingleAmtLoading: string;
  perDayCap: string;
  status: string;
  createdOn: string;
  createdBy: string;
}

@Component({
  selector: 'search-e-wallet',
  templateUrl: './search-e-wallet.component.html',
  styleUrls: ['./search-e-wallet.component.scss']
})
export class SearchEWalletComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'E-wallet',
    link: ''
  }
  ];

  displayedColumns: string[] = ['srNo', 'walletName', 'currency', 'minimumBalance', 'maximumBalance', 'maximumSingleAmtLoading', 'perDayCap', 'status','createdOn','createdBy'];
  dataSource: MatTableDataSource<TxnData>;

  public searchEwalletFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  status = true;
  public storeList: any = [];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.buildStoreForm();
    this.dataSource = new MatTableDataSource();
  }
  openFilter() {
    this.status = !this.status;
  }

  getUpdate(event) {
  }

  resetForm() {
    this.buildStoreForm();
    this.getUpdate(this.paginationData);
  }
  searchKey() {
    this.getUpdate(this.paginationData);
  }

  searchVal() {
  }

  buildStoreForm() {
    this.searchEwalletFormGroup = this.fb.group({
      storeId: [""],
      orderType: [""],
      startDate: [""],
      endDate: [""],
      searchVal: [""]
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.searchVal();
  }

}