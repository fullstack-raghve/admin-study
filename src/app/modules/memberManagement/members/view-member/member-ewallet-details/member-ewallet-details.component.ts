import { BehaviorSubject } from 'rxjs';
import { CommonFunctions } from 'src/app/services/common-functions';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Sort, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface eWalletDetails {
  slNo: number;
  txnID: string;
  txnAmount: string;
  credit: string;
  debit: string;
  balance: string;
  txnDate: string;
}

@Component({
  selector: 'member-ewallet-details',
  templateUrl: './member-ewallet-details.component.html',
  styleUrls: ['./member-ewallet-details.component.scss']
})
export class MemberEwalletDetailsComponent implements OnInit {
  public loadingEwalletResponse: boolean = false;
  public eWalletResultsLength = 0;
  public sortWalletColumn = "createdTime";
  public sortWalletDirection = "desc";
  public eWalletPaginationData;
  public currencyCode = '';
  public currencyCodesData: any = [];
  public selectedwalletData: any;
  public noWalletsFound: boolean = false;
  @Input() memberId;
  displayedWalletDetails: string[] = ['slNo', 'txnID', 'txnAmount', 'credit', 'debit', 'balance', 'txnDate'];
  dataSource: MatTableDataSource<eWalletDetails>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) walletPaginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.walletPaginator;
  }

  constructor(private https: HttpService,public router: Router,
    private commonFunctions: CommonFunctions) {
    this.dataSource = new MatTableDataSource();
  }
  
  ngOnInit() {
    console.log(this.memberId);
    this.getCurrencyCodeData();
  }
  
  public getCurrencyCodeData() {
    console.log(this.memberId);
    this.https.getJson(environment.EwalletEndpoint + 'api/rpa/ewallet/getUserWallets' + '?userOid=' + this.memberId).subscribe(res => {
      this.currencyCodesData = res['responseBody'];
      this.noWalletsFound = res['responseBody'].length == 0 ? true : false;
      this.selectedwalletData = res['responseBody'][0];
      this.currencyCode = res['responseBody'][0]['currencyCode'];
      this.searchWallet();
    })
  }

  public getWalletData(walletdata) {
    console.log(walletdata)
    this.selectedwalletData = walletdata;
     this.searchWallet();
  }

  searchWallet() {
    this.loadingEwalletResponse = true;
    let data =
    {
      "merchantEwalletOID": this.selectedwalletData.merchantEwalletOID,
      // "merchantEwalletOID": 39,
      "userID": this.memberId
    }
    this.https.postJson(environment.EwalletEndpoint + 'api/rpa/ewallet/viewUserWalletTxns', data).subscribe(response => {
      console.log(response);
      this.dataSource = new MatTableDataSource(response['responseBody']);
      this.dataSource.sort = this.sort;
      this.eWalletResultsLength = response['responseBody'].length;
      this.dataSource.paginator = this.walletPaginator;
      this.loadingEwalletResponse = false;
    }, (err) => {
      this.loadingEwalletResponse = false;
    });
  }

  sortWalletData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortWalletColumn = "modifiedTime";
      this.sortWalletDirection = "desc";
    } else {
      this.sortWalletColumn = sort.active;
      this.sortWalletDirection = sort.direction;
    }
    this.searchWallet();
  }

  viewTransactionPage(ID) {
    localStorage.setItem('memberOid', this.memberId);
    localStorage.setItem('TxnOid', ID);
    this.router.navigate(['/view-transaction'])
  }

}
