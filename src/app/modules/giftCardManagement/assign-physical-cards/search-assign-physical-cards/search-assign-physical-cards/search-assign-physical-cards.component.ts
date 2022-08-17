import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { environment } from '../../../../../../../src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import * as moment from 'moment';

export interface UserData {
  cardtype: string;
  assignId: string;
  assignmentName: string,
  CorporteORstoreName: string;
  storeId: number;
  cardQuantity: number;
  handedOverTo:string;
  CREATION_TIME:string;
}
@Component({
  selector: 'app-search-assign-physical-cards',
  templateUrl: './search-assign-physical-cards.component.html',
  styleUrls: ['./search-assign-physical-cards.component.scss']
})
export class SearchAssignPhysicalCardsComponent implements OnInit {

  public searchNotificationForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Assign Physical Cards',
    link: ''
  }
];
  public displayedColumns: string[] = ['cardtype', 'assignId', 'assignmentName', 'CorporteORstoreName', 'storeId',  'cardQuantity','handedOverTo','CREATION_TIME'];
  public status = true;
  public dataSource;
  public minDate = '2020-01-01' ;
  public maxDate = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchStoreVal = true;
  NoRecord= false;
  notification_data = [];
  corporateDetails: any;
  StoreDetails: any;
  //   {
  //     cardtype: 'Elite',
  //     assignId: 'RP12323 ',
  //     assignmentName: 'TT july 2019 batch',
  //     CorportestoreName: 'Indian express',
  //     storeId: -12,
  //     cardQuantity: 1000,
  //     handedOverTo:'sandra',
  //     CREATION_TIME:'29-02-2019 12:45 PM'
  //   },
  //   {
  //     cardtype: 'Elite',
  //     assignId: 'RP12323 ',
  //     assignmentName: 'TT july 2019 batch',
  //     Corporte/storeName: 'Indian express',
  //     storeId: 12,
  //     cardQuantity: 1000,
  //     handedOverTo:'sandra',
  //     CREATION_TIME:'29-02-2019 12:45 PM'
  //   },
  // ];


  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {


  }

  ngOnInit() {
    // this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.buidsearchNotificationForm();
    this.searchVal();
    this.getCorporateId();
    this.getStoreId();
  }
  // getSearchData(){
  //   let  TempURL ="https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_search_filter"
  //   let data = {
      
  //       "startDate":'' ,
  //       "endDate": '',
  //       "corporateId":'',
  //       "storeId":''    
  //   }  
  //   this.NoRecord=false;
  //   return this.http.postCustomizeJson(TempURL, data)
  //     .subscribe((response) => {
  //       console.log(response);
  //       console.log(JSON.stringify(response));
  //       let value = response;
  //       this.notification_data = value['Output'];
  //       console.log(this.notification_data);
  //       this.searchStoreVal = false
  //       // const notification_data: UserData[] = NewColums;
  //        this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
  //       this.dataSource = new MatTableDataSource(response["Output"]);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       if(this.notification_data.length==0){
  //         this.NoRecord=true;
  //       }

  //     },
  //       (error) => {
  //         console.log(error);

  //       });
  // }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.filter !=this.dataSource.filter) {
      this.NoRecord = true;
    } else {
      this.NoRecord = false;
    }
  }
  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchNotificationForm = this.fb.group({
      startDate: [""],
      endDate: [""],
      corporateId: ["",],
      storeId: ["",],
      searchVal:['']
    });
  }
  searchVal() {
    let formData = this.searchNotificationForm.value;
    this.searchStoreVal = true;  
    let StartDate = '';
    let EndDate = '';
    if(formData['startDate']){
      StartDate = moment(formData['startDate']).format('YYYY-MM-DD');
     }
     if(formData['endDate']){ 
       EndDate = moment(formData['endDate']).format('YYYY-MM-DD');
     }
  let  TempURL ="https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_search_filter"
    let data = {
      
        "startDate":StartDate ,
        "endDate": EndDate,
        "corporateId":formData.corporateId,
        "storeId":formData.storeId     
    }  
    // console.log(data);
    this.NoRecord=false;
    return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        // console.log(response);
        this.dataSource = new MatTableDataSource(response["Output"]);
        // console.log(JSON.stringify(response));
        let value = response;
       let notification_data = value['Output'];
        // console.log(this.notification_data);
        this.searchStoreVal = false;
        if(notification_data[0] == 'No data found'){
          this.notification_data.length = 0;
          
        }else{
          this.notification_data = notification_data;
         
        }
        // const notification_data: UserData[] = NewColums;
       this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.notification_data.length==0){
          this.NoRecord=true;
        }

      },
        (error) => {
          // console.log(error);

        });

  }
  resetForm() {
    this.searchNotificationForm.reset();
    this.searchVal();
  }
  getCorporateId() {
    let data = {
      "searchText": ""
    }
    this.https.postCustomizeJson('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate_list', data).subscribe(res => {
      // console.log(res);
      this.corporateDetails = res['Output'];
      // console.log(this.corporateDetails);


    });
  }
  getStoreId(){
    let data = {
      "languageCode": "en"
    }
    this.https.postCustomizeJson('https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_stores', data).subscribe(res => {
      // console.log(res);
      this.StoreDetails = res['Output'];
      // console.log(this.StoreDetails);


    });
  }

}
