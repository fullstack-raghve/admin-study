import { OnInit, ViewChild, Input, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';

const queryParamName = "pippo";

export interface Element {
  locationId:number;
  locationName: string;
  countryName: string;
  cityName: string;
 
}


@Component({
  selector: 'app-select-location-dialog',
  templateUrl: './select-location-dialog.component.html',
  styleUrls: ['./select-location-dialog.component.scss']
  //encapsulation: ViewEncapsulation.None,

})
export class SelectLocationDialogComponent implements OnInit {
  displayedColumns = ['select','locationName', 'countryName', 'cityName'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 selection = new SelectionModel<any>(true, []);
  public dataSource;
  public searchStoreForm: FormGroup;

  public noRecords: boolean = false;
  public arrlength = [10, 20, 50, 100];
  public total: number;
  public updatedTotal;
  //dataSource : MatTableDataSource<object>;
  status:boolean;
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  //public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

  public selectedOptions;

  public storeOidValue;
  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallList: any = [];

  cityy = new FormControl();
  selectedmulticity;
  

 

  originalSelection;
  stores = [];
  allBrands = [];
  isFilterOn = false;
  dataInView = [];
  checkboxClicked = false;
  public programType;
  public Disable:boolean=true;
  searchLocationForm:FormGroup;
  @Input('locationitem') locationitem = [];

  eventData: any[];
///////////////////////////////////
  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedCountryOptions : any[];
  countries: any[];
  cities: any[];
  cityList: any;
  brandList: any[];
  mallListall: any[];
  countrylistCity: any;
  brandId: any;
  cityId: any;
  countryIds: any;
  countryList: any = [];
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  public countryIdval;
  public brandValueList = [];
  loadingResponse: boolean = true;

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;

  allBrandCountryCityMallList = [];
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  public selectAll: boolean = false;

  selectedMallOptions: any[];
  brandOid: number;
  loading: boolean;
  selcountryId: any;
  allocations: any;
  public resultsLength = 0;
  public paginationData;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  
  constructor(private fb: FormBuilder,
    private commonFunctions: CommonFunctions,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>) {
      dialogRef.disableClose = true;
    //  this.dataSource = new MatTableDataSource();
  }



  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
  
    this.buidsearchLocationForm();

  
   // this.getJsonTable();
   /// this.fetchAllLOcation();
    this.getAllCountries();

  //  this.dataSource = this.eventData;
    //  this.dataSource.paginator = this.paginator;

   // this.dataSource.forEach((row, i) => row.selectable = i === i);
 


  }



     buidsearchLocationForm() {
      this.searchLocationForm = this.fb.group({
        searchLocationField: [""],
        country: [''],
        // Brand:[''],
        // cityName:[''],
       
      });
      this.fetchAllLOcation();
    }
    openFilter() {
      this.status = !this.status;
    }


  
   public loader:boolean = true;
    fetchAllLOcation(){

      let formData= this.searchLocationForm.value;
   // console.log('formData',formData)
    
     let data2 = {
      "universalId": formData.searchLocationField ? formData.searchLocationField : "",
      "countryOid": +formData.country ? formData.country : '',
      "cityOid": this.selectedmulticity ? this.selectedmulticity : [],
      "languageCode": "en" 
    }

    let data1 = {
    
      "universalId": formData.searchLocationField ? formData.searchLocationField : "",
    "countryOid": +formData.country ? formData.country : '',
    "cityOid": this.selectedmulticity ? this.selectedmulticity : [],
    "languageCode": "en" ,
    "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
    "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
    "order":{
     "column":this.sortColumn,
     "dir":this.sortDirection
      }
     
    
    
    }
   // console.log('req body',data2);
    this.loader  = true;
    // let url = 'https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/view_events'
     this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data1).subscribe(res => {
    if(res['statusCode']===200){
      this.loading = false;
      this.noRecords = false;
      let allLocation = res['output']['searchOutput'];;
     // this.allocations = res['locationOid'];
      this.dataSource = new MatTableDataSource<any>(allLocation);
      this.resultsLength = res['output']["totalCount"];
      // this.dataSource.paginator = this.paginator;
      //  this.dataSource.sort = this.sort;
       this.loader = false;
      console.log('get all locations',res);
      console.log('loc items selected>>>',this.locationitem)
     // this.makeSelected(allLocation);


     /////
     if (this.locationitem.length > 0) {
      for (let i of allLocation) {
        if (this.locationitem.indexOf(i["locationOid"]) > -1) {
          this.selection.select(i);
        }
      }
    } 

    // if (this.popupdata.selectedUsers.length > 0) {
    //   for (let i of res["items"]) {
    //     if (this.popupdata.selectedUsers.indexOf(i["userId"]) > -1) {
    //       this.selection.select(i);

    //    ///delet selected id insted show selected   this.selection.select(i);
    //            /// this.selectedUsers.splice(i, 1);

    //     }
    //   }
    //   this.originalSelection = this.selection.selected;
    // }
     /////
    
    }
    if(res['errorMessage']==='No data found'){
   // alert('no data found');
   this.loader = false;

    this.noRecords = true;
    let allLocation = []
    this.dataSource = new MatTableDataSource<any>(allLocation);
    }
     },
     (error) => {
      this.noRecords = true;
      this.loader = false;

     // alert('ccc')
     let allLocation = []
     this.dataSource = new MatTableDataSource<any>(allLocation);
    }
     )

    
    }
  
    getAllCountries() {
      let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
      this.https.getJson(GET_ALL_COUNTRIES)
          .subscribe((response) => {
              this.countries = response;
          })
      
    }
    public sortColumn = "";
    public sortDirection = "desc";
    //public sortDirection = "";
    sortData(sort: Sort) {
    console.log('sor>>>',sort)
      if (!sort.active || sort.direction == '') {
        this.sortColumn = "";
       // this.sortDirection = "";
        this.sortDirection = "desc";
        console.log('if>>>')
    
      } else {
        this.sortColumn = sort.active;
        this.sortDirection = sort.direction;
        console.log('else>>>')
    
      }
    
      this.fetchAllLOcation()
    }

    filterCity(countryId){
      console.log('countryId',countryId);
      this.selcountryId = countryId;
      this.selectedCityOptions = [];
      this.selectedmulticity  = [];
       if (countryId != '' && countryId != null && countryId != undefined) {
         // this.disabledCity = false;
         let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
         this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
           .subscribe((response) => {
             console.log('cityyy',response);
             this.cities = response;
            
           })
       } else {
         this.cityList = [];
         this.selectedmulticity  = [];
      
        
       }
      }

    resetForm() {
      this.noRecords = false;
      this.selectedmulticity = [];
      this.searchLocationForm.get('searchLocationField').reset();
      
     this.searchLocationForm.reset();
     this.fetchAllLOcation();
    
    }




    makeSelected(allLocation){
      if (allLocation.length > 0) {
        for (let i of this.allocations) {
          if (this.locationitem.indexOf(i["locationOid"]) > -1) {
            this.selection.select(i);
          }
        }
        this.originalSelection = this.selection.selected;
      }
    }
  eventPreventDefault($event, flag =false) {
    $event.preventDefault();
    //this.getLocalStorageSearchList(flag);
    return false;
  }

  applyFilter2(filterValue: string) {
    this.dataSource = new MatTableDataSource<Element>(this.eventData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    console.log('filter val',filterValue)
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    console.log(' this.dataSource.filter', this.dataSource.filter)
  }



  searchVal(x){
    /////////////////
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.originalSelection,
      'totalCount': this.resultsLength
    }
    //localStorage.removeItem('stores');
    // localStorage.setItem('stores', JSON.stringify(this.stores));
    this.dialogRef.close(obj);
  }

  // selectRow($event: any, row:Element){
  //   console.info("clicked", $event);
  //   $event.preventDefault();
  //       if (row.selectable && !row.selected) {
  //           this.dataSource.forEach((row) => row.selected = false);
  //           row.selected = true;
  //           this.selection.select(row);
  //           if (location.href.indexOf(queryParamName) >= 0) {
  //               location.href = location.href.replace(queryParamName, "");
  //           }
  //       }
  // }


  getUpdate(event) {

    // sessionStorage.setItem('paginationData',JSON.stringify(event));
     this.paginationDetail.next(event);
     this.paginationData = event;
     this.fetchAllLOcation();
   
   
   }
}




