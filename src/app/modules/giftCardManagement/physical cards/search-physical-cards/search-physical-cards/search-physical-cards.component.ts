import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { environment } from '../../../../../../environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import * as XLSX from 'xlsx';

export interface UserData {
  SL_NO: string;
  CARD_TYPE: string;
  START_RANGE: string;
  END_RANGE: string;
  QUANTITY: number;
  Generation_date: string;
  physicalCardId: string;
}
@Component({
  selector: 'app-search-physical-cards',
  templateUrl: './search-physical-cards.component.html',
  styleUrls: ['./search-physical-cards.component.scss']
})
export class SearchPhysicalCardsComponent implements OnInit {

  // public breadCrumbData: Array<Object> = [{
  //   title: 'Home',
  //   link: ''
  // }, {
  //   title: 'Gift Cards Management',
  //   link: ''
  // },
  // ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    // link: '/view-client-on-boarding'
  },
  {
    title: 'Physical Card',
    link: ''
  }
  ];
  CardType=[];
  public searchPhysicalCard: FormGroup;
  public displayedColumns: string[] = ['SL_NO', 'CARD_TYPE', 'START_RANGE', 'END_RANGE', 'QUANTITY', 'Generation_date','physicalCardId'];
  public status = true;
  dataSource: MatTableDataSource<UserData>;
  public datashow:any;
  searchStoreVal = true;
   notification_data: UserData[] = [ ];
   public minDate = '2020-01-01' ;
   public maxDate = new Date();
   NoRecord=false;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {


  }

  ngOnInit() {
    this.buidsearchNotificationForm();
    this.getCardType();
    this.searchVal();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
  }


  getCardType(){
    let TempURL ="https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type";
    let data={}
    return this.http.postCustomizeJson(TempURL, data)
    .subscribe((response) => {
      // console.log(response);
       this.CardType=(response['Output']);      
    });

  }
  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchPhysicalCard = this.fb.group({
      cardType: [""],
      startDate: [""],
      endDate: [""],
      searchVal:[""]
    });
  }
   searchVal() {
    this.searchStoreVal = true;
    let StartDate = '';
    let EndDate = '';
     let Data = this.searchPhysicalCard.value;
     if(Data['startDate']){
      StartDate = moment(Data['startDate']).format('YYYY-MM-DD');
     }
     if(Data['endDate']){ 
       EndDate = moment(Data['endDate']).format('YYYY-MM-DD');
     }
     this.NoRecord=false;
    let TempURL ="https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_physical_card_filter";
    let data={
      "cardType":Data['cardType'],
      "generationDateFrom": StartDate ,
      "generationDateTo": EndDate
      }
      // console.log(JSON.stringify(data))
     return this.http.postCustomizeJson(TempURL, data)
    .subscribe((response) => {
      let notification_data = response['Output'];
        // console.log(this.notification_data);
        this.searchStoreVal = false;
      if(notification_data[0] == 'No data found'){
        this.notification_data.length = 0;
        
      }else{
        this.notification_data = notification_data;
       
      }
      this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
        if(this.notification_data.length==0){
          this.NoRecord = true
        }  
    }); 
  }

  resetForm() {
    this.buidsearchNotificationForm();
    this.searchVal();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  DownloadXLS(value) {
 let TempURL ="https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/download_physical_card_code_api";
    let data={
      physicalCardId:value
      }
      // console.log(JSON.stringify(data))
     return this.http.postCustomizeJson(TempURL, data)
    .subscribe((response) => {    
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(response['Output']);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'physicalcard');

    /* save to file */
    XLSX.writeFile(wb, 'PhysicalCards.xlsx');
          
            }
    );
   
    }
 
   
}
