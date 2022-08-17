import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import * as access from 'src/app/constants/countries.constant';
import { MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { Router} from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';
export interface UserData {
  customerId: number;
  firstName: string;
  lastName: string;
  phoneNo: string;
  emailId: string;
  tierName: string;
  gender: string;
  dateOfBirth: string;
  lastActiveTime: string;
  status: string;
}

@Component({
  selector: 'search-member',
  templateUrl: './search-member.component.html',
  styleUrls: ['./search-member.component.scss']
})
export class SearchMemberComponent implements OnInit {
  public buildFlag: boolean = false;
  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  }
  ];
  public searchStoreVal: boolean = false;
  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchMemberFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['customerId', 'firstName', 'lastName', 'phoneNo', 'emailId', 'tierName', 'gender', 'dateOfBirth', 'nationality', 'lastActiveTime', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public countryNameList = [];
  public countryJsonList = access.countries.country;
  public languageList = JSON.parse(localStorage.getItem("languageList"));

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  status = true;
  public countries = [];
  public maxDOB;
  public searchData : any;

  constructor(private fb: FormBuilder, private https: HttpService, public router: Router,private commonFunctions: CommonFunctions) {
    this.clearForm();
    const storeList: UserData[] = [];
    this.dataSource = new MatTableDataSource(storeList);
    this.maxDOB = new Date();
    this.maxDOB.setFullYear(this.maxDOB.getFullYear() - 15);
  }


  public clearForm() {
    let data = this.searchData;
    let form = {
      memberPhoneNumber: [data != undefined ? data.memberPhoneNumber : '', Validators.compose([Validators.minLength(8), Validators.pattern("^[0-9]*")])],
      memberId: [data != undefined ? data.memberId : ''],
      transactionId: [data != undefined ? data.transactionId : ''],
      memberFirstName: [data != undefined ? data.memberFirstName : '', Validators.pattern("[a-zA-Z\u0600-\u06FF ]*")],
      memberLastName: [data != undefined ? data.memberLastName : '', Validators.pattern("[a-zA-Z\u0600-\u06FF ]*")],
      memberEmail: [data != undefined ? data.memberEmail : '', Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      country: [data != undefined ? data.country : ''],
      searchVal: [data != undefined ? data.searchVal : ''],
      dateOfBirth: [data != undefined ? data.dateOfBirth : '']

    }
    this.searchMemberFormGroup = this.fb.group(form);
  }

  ngOnInit() {
    this.getAllCountries();
    // this.clearForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    if(sessionStorage.getItem('searchMember')){
      this.searchData = JSON.parse(sessionStorage.getItem('searchMember'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }
    this.clearForm();


    if(sessionStorage.getItem('CheckType')=='MembersList')
    {
          if (sessionStorage.searchValue) {
      this.searchMemberFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
    }
    if (sessionStorage.paginationData) {
      let obj = JSON.parse(sessionStorage.paginationData);
      this.paginationDetail = new BehaviorSubject({
        length: obj.length,
        pageIndex: obj.pageIndex,
        pageSize: obj.pageSize
      });
      this.paginationDetail.next(obj);
      this.paginationData = obj;
      this.searchVal();
      this.paginator.pageIndex = obj.pageIndex;
    } else {
      this.searchVal();
    }
  }else{
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType','MembersList');
    }
    // this.searchVal();
    this.countryJsonList = access.countries.country;
    this.countryJsonList.forEach(country => {
      this.countryNameList.push(country);

    });
    //this.dataSource.sort = this.sort;
  }
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {

    this.countryNameList = this.countryJsonList.filter(option => option.name.toLowerCase() === (event.option.value.toLowerCase()));

    const item = <FormArray>this.searchMemberFormGroup.controls['countryLocale'];

    for (let i = 1; i < this.languageList.length; i++) {
      item.at(i).patchValue({
        countryName: this.countryNameList[0].name_ab
      })
    }

    this.searchMemberFormGroup.patchValue({
      countryCode: this.countryNameList[0].code
    })
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  openFilter() {
    this.status = !this.status;
  }
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchMemberFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortColumn,
        "dir": this.sortDirection
      },
      "keySearch": sessionStorage.getItem('searchValue'),
      "fieldSearch": [
        {
          "fieldName": "oid",
          "fieldValue": formdata.memberId != null ? formdata.memberId : ''
        },
        {
          "fieldName": "firstName",
          "fieldValue": formdata.memberFirstName != null ? formdata.memberFirstName : ''
        },
        {
          "fieldName": "lastName",
          "fieldValue": formdata.memberLastName != null ? formdata.memberLastName : ''
        },
        {
          "fieldName": "emailId",
          "fieldValue": formdata.memberEmail != null ? formdata.memberEmail : ''
        },
        {
          "fieldName": "phoneNumber",
          "fieldValue": formdata.memberPhoneNumber != null ? formdata.memberPhoneNumber : ''
        },
        {
          "fieldName": "transactionId",
          "fieldValue": formdata.transactionId != null ? formdata.transactionId : ''
        },
        {
          "fieldName": "countryId",
          "fieldValue": formdata.country != null ? formdata.country : ''
        },
        {
          "fieldName": "dateOfBirth",
          "fieldValue": formdata.dateOfBirth != null && formdata.dateOfBirth != '' ? moment(formdata.dateOfBirth).format('DD-MM-YYYY') : ''
        }
      ]
    }
    this.setSearchData();
    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberMgmt/v1/searchMember', data)
      .subscribe(
        (res) => {
          this.searchStoreVal = false;
          this.dataSource = new MatTableDataSource(res["items"]);
          //this.dataSource.sort = this.sort;
          this.resultsLength = res["totalCount"];
          if (this.resultsLength == 0) {
            this.noRecords = true;
          } else {
            this.noRecords = false;
          }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
  }
  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;

      })
  }

  resetForm() {
    this.searchData = undefined;
    this.clearForm();
    this.searchVal();
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
  viewMember(ID){
    localStorage.setItem('memberCustomerId',ID);
    this.router.navigate(['/view-member']);
  }

  public setSearchData(){
    let formdata = this.searchMemberFormGroup.value;
    let selectedData = {
      memberId: formdata.memberId,
      memberFirstName: formdata.memberFirstName,
      memberLastName: formdata.memberLastName,
      memberEmail: formdata.memberEmail,
      memberPhoneNumber: formdata.memberPhoneNumber,
      transactionId: formdata.transactionId,
      country: formdata.country,
      dateOfBirth: formdata.dateOfBirth,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('searchMember', JSON.stringify(selectedData))
  }

}
