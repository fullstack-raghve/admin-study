import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewHistoryDialogComponent } from '../../view-history-dialog/view-history-dialog.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute } from '@angular/router';

export interface UserData {
  
  from: string;
  to: string;
  name: string;
  dateTime: string;
  comment: string;
}

@Component({
  selector: 'app-view-search-gift-cards',
  templateUrl: './view-search-gift-cards.component.html',
  styleUrls: ['./view-search-gift-cards.component.scss']
})

export class ViewSearchGiftCardsComponent implements OnInit {
  loadingResponse = true;
  viewdata=[];
  viewDataDetails:any=[]
  public cardOid
  transactionHistory=[];
  displayedColumns: string[] = ['oldStatus', 'newStatus', 'name', 'dateTime', 'comment'];
  public dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  notification_data: UserData[] = []
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  constructor(public dialog: MatDialog,private activatedRoute: ActivatedRoute, private http: HttpService, private https: HttpService, ) { 
    this.activatedRoute.params.subscribe((params) => {
      // this.getCorporateId = params['id'];
      this.cardOid = params['id'];
    });
  }

  ngOnInit() {
    this.getViewData()
  }
  // component calling methods
getViewData(){
  // console.log(this.cardOid);
  
  let data={
    "cardOid": this.cardOid
  }
  this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/get_card_detail', data).subscribe(res => {
    // console.log(res['Output']);
    // console.log(JSON.stringify(res['Output']));
    this.viewdata=res['Output']
    this.loadingResponse = false;
    for(let i=0;i< this.viewdata.length;i++){
      this.viewDataDetails=this.viewdata[i]
      this.notification_data=this.viewdata[i]['history']
      this.transactionHistory=this.viewdata[i]['transactionHistory']
    }
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  })
}

  // historyDialog() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.autoFocus = false;
  //   const dialogRef = this.dialog.open(
  //     ViewHistoryDialogComponent,
  //     dialogConfig
  //   );
  // }
  historyDialog() {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    // const dialogRef = this.dialog.open(
    //   CorporateAccountHistoryComponent,
    //   dialogConfig
    // );
    const dialogRef = this.dialog.open(ViewHistoryDialogComponent);
    dialogRef.componentInstance.historyList = this.transactionHistory;
  }
}
