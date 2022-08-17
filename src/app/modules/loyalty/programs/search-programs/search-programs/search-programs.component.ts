import { OnInit, ViewChild, Component, } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface UserData {
  programId: number;
  publishStatus: string;
  programName: string;
  rewardType: string;
  endDate: string;
  modifiedOn: string;
  approvalStatus: string;
  status: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}


@Component({
  selector: 'search-programs',
  templateUrl: './search-programs.component.html',
  styleUrls: ['./search-programs.component.scss']
})
export class SearchProgramsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Loyalty',
    link: ''
  }, {
    title: 'Programs',
    link: '/search-products'
  }
  ];


  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;

  @ViewChild("searchProgramsForm") searchProgramsForm;
  searchProgramsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['publishStatus', 'programName', 'rewardType', 'endDate', 'modifiedOn', 'approvalStatus', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public paginationData;
  public resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  status = true;
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  public brandList: any = [];
  public storeBrandList: any = [];
  CheckType='Program';
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(
    private fb: FormBuilder,
    private https: HttpService, private router: Router
  ) {
    this.buildCreateProductsForm();
    const storeList: UserData[] = [];
    this.dataSource = new MatTableDataSource(storeList);
  }


  ngOnInit() {
    this.buildCreateProductsForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    this.dataSource.sort = this.sort;
    this.getAllBrands();
    this.getAllStoreBrands();
    if(sessionStorage.getItem('CheckType')==this.CheckType){
    if (sessionStorage.searchValue) {
      this.searchProgramsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
    }

    if (sessionStorage.paginationData ) {
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
    sessionStorage.setItem('CheckType','Program');
  }
   
  }

  public getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        console.log(response);
        this.brandList = response;
      })
  }


  getAllStoreBrands() {
    // console.log(this.KioskForm.get('brands').value);

    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objMallkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          console.log(objMallkey);
          this.Brands.push(objMallkey);
        }
        this.filteredbrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  public brandOid;

  getbrandID(brandId) {
    console.log(brandId);
    this.brandOid = brandId;
  }

  // public getAllStoreBrands() {
  //   let GET_ALL_STORE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
  //   this.https.getJson(GET_ALL_STORE_BRANDS)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.storeBrandList = response;
  //     })
  // }



  openFilter() {
    this.status = !this.status;
  }

  public buildCreateProductsForm() {
    let form = {
      rewardsType: [""],
      liveOrUpcoming: [""],
      approvalStatus: [""],
      brandOid: [""],
      searchVal: [""],
      status: [""],
    }
    this.searchProgramsFormGroup = this.fb.group(form);
  }


  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey(){
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {  
    let formdata = this.searchProgramsFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchStoreVal = true;
    // if (!this.searchProgramsFormGroup.invalid) {

    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": sessionStorage.getItem('searchValue'),
      "fieldSearch": [
        {
          "fieldName": "rewardType",
          "fieldValue": formdata.rewardsType
        },
        {
          "fieldName": "publishStatus",
          "fieldValue": formdata.liveOrUpcoming
        },
        {
          "fieldName": "approvalStatus",
          "fieldValue": formdata.approvalStatus
        },
        {
          "fieldName": "brand.oid",
          "fieldValue": this.brandOid != undefined ? this.brandOid : ""
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        },
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/search', data)
      .subscribe(
        (res) => {
          this.searchStoreVal = false;
          this.dataSource = new MatTableDataSource(res["items"]);
          this.dataSource.sort = this.sort;
          this.resultsLength = res["totalCount"];
          if (this.resultsLength == 0) {
            this.noRecords = true;
          } else {
            this.noRecords = false;
          }
          // this.dataSource = new MatTableDataSource(res["items"]);
          // this.dataSource.sort = this.sort;
          // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
          //   this.paginationData.pageIndex = 0;
          //   this.paginator.pageIndex = 0;
          //   this.searchVal();
          //  }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
  //  }
      }       

  resetForm() {
    this.noRecords = false;
    this.brandOid = "";
    this.buildCreateProductsForm();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
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
  moveToView(ID){
    // alert('hi');
     localStorage.setItem('ViewID',ID);
    this.router.navigate(['/view-programs'])
   
  }
}
