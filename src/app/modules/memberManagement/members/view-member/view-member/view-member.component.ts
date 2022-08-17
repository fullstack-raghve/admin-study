import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { EditMemberDialogComponent } from '../edit-member-details-dialog/edit-member-dialog.component';
import { SendVerificationDialogComponent } from '../send-email-verifcation-dialog/send-email-verifcation-dialog.component';
// import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { ExtendedExpiryDialogComponent } from '../extended-expiry-dialog/extended-expiry-dialog.component';
import { SendOtpDialogComponent } from '../send-otp-dialog/send-otp-dialog.component';
import { ChangeHistoryDialogComponent } from '../change-history-dialog/change-history-dialog.component';
import { SearchTransactionIdDialogComponent } from '../search-transaction-id-dialog/search-transaction-id-dialog.component';
// import { Observable } from 'rxjs';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { ManualTxnViewDialogComponent } from '../manual-txn-view-dialog/manual-txn-view-dialog.component';
import { AddEnquiryDialogComponent } from '../add-enquiry-dialog/add-enquiry-dialog.component';
import { SelectTransactionDialogComponent } from '../select-transaction-dialog/select-transaction-dialog.component';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { SendEmailVerificationErrorComponent } from '../send-email-verification-error/send-email-verification-error.component';
import { Pipe, PipeTransform } from '@angular/core';
// import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take';
import { MatTabChangeEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface PastDebitData {
  date: string;
  transactionId: string;
  transactionType: string;
  numberOfPoints: string;
  reason: string;
  brands: string;
  referenceTransactionId: string;
  englishDescription: string;
  arabicDescription: string;
}

export interface UserData {
  referenceId: number;
  enquiryType: string;
  internalEnquiryType: string;
  countryName: string;
  cityName: string;
  enquiryDate: string;
  status: string;
}
export interface TransactionData {
  transactionId: number;
  transactionType: string;
  brandName: string;
  storeName: string;
  totalAmount: string;
  transactionDate: string;
  status: string;
}

export interface PointsData {
  programName: string;
  balance: string;
}

export interface TransactionDataForPoints {
  transId: number;
  transactionDate: string;
  transactionType: string;
  programName: string;
  earnRuleOid: string;
  pointsEarned: string;
  freeProductAccrued: string;
  pointsRedeemed: string;
  pointsReversed: string;
  // pointsExpiry:string;
}
export interface PersonalisedCouponData {
  couponId: number;
  couponTitle: string;
  couponExpiryTime: string;
  couponStatus: string;
  transactionId: string;
  usageLimitPerUser: string;
  couponUsedCount: string;
  status: string;
}
export interface communicationDetails {
  campaignId: number;
  campaignName: string;
  activityType: string;
  notificationDate: string;
  communicationType: string;
  campaignstatus: string;
}

export interface Country {
  countryId: number;
  countryName: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}

export interface Store {
  storeOid: number;
  storeName: string;
}

export interface Program {
  programId: number;
  programName: string;
}

export interface ProgramFilter {
  programId: number;
  programName: string;
}

@Component({
  selector: 'view-member',
  templateUrl: './view-member.component.html',
  styleUrls: ['./view-member.component.scss']
})

export class ViewMemberComponent implements OnInit {
  public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };
  public pointFormSumited: boolean = true;
  public minDate: Date = new Date();
  public toggleVal: boolean = true;
  public disabled: boolean = false;
  public checked: boolean = false;
  public disableValuetxns: boolean = true;
  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  }
  ];
  public transactionTypeVal;
  public FreeProductValueSelection;
  @ViewChild('tabGroup') tabGroup;
  public dataValue = 'Quantity';
  txnIDVal;
  selectedBrandId;
  public selectedrewardTypeVal;
  public selectedReason: any;
  editTxn: boolean = false;
  userId;
  readonly progress: Observable<number>;

  displayedPastDebit: string[] = ['date', 'transactionId', 'transactionType', 'numberOfPoints', 'reason', 'brands', 'referenceTransactionId', 'englishDescription', 'arabicDescription'];
  dataSource1: MatTableDataSource<PastDebitData>;
  displayedEnquiryColumns: string[] = ['referenceId', 'enquiryType', 'internalEnquiryType', 'countryName', 'cityName', 'enquiryDate', 'enquiryStatus'];
  dataSource2: MatTableDataSource<UserData>;
  displayedTransactionColumns: string[] = ['transactionId', 'transactionType', 'brandName', 'storeName', 'totalAmount', 'transactionDate', 'discountAmount', 'couponUsed', 'txnStatus'];
  dataSource3: MatTableDataSource<TransactionData>;
  displayedPointsColumns: string[] = ['programName', 'balance'];
  pointDataSource: MatTableDataSource<PointsData>;
  displayedPointsTabColumns: string[] = ['txnRewardOid', 'txnOid', 'txnDate', 'txnType', 'programName', 'earnRuleOid', 'loyaltyType', 'accrual', 'freeProductAccrued','redeemed', 'expired', 'pointsReversed'];
  displayedPersonalisedCouponsColumns: string[] = ['couponId', 'couponTitle', 'couponExpiryTime', 'couponStatus', 'transactionId', 'usageLimitPerUser', 'couponUsedCount', 'status'];
  dataSource5: MatTableDataSource<TransactionDataForPoints>;
  dataSource7: MatTableDataSource<PersonalisedCouponData>;
  displayedCommunication: string[] = ['campaignId', 'campaignName', 'activityType', 'notificationDate', 'communicationType', 'campaignstatus'];
  dataSource8: MatTableDataSource<communicationDetails>;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild(MatPaginator) paginator3: MatPaginator;
  @ViewChild(MatPaginator) paginator7: MatPaginator;
  @ViewChild(MatPaginator) paginator8: MatPaginator;
  @ViewChild(MatSort) sort7: MatSort;
  @ViewChild(MatSort) sort8: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  public menuIds: any = localStorage.getItem("navigationArray");
  public showApprovalBtn = false;
  public updatePermission = true;

  public showEmailApprovalBtn = false;
  public freeProductVal = false;
  public updateEmailPermission = true;
  countVal: boolean = true;
  public paginationData;
  public manualPoints: boolean = false;
  public viewMemberData: boolean = false;
  public memberId = 0;
  public emailId;
  public basicDetails = [];
  public customerWalletDtls;
  public enquiryResultsLength = 0;
  public txnHistoryLength = 0;
  public txnRewardHistoryLength = 0;
  public currencies: any = [];
  public regionCurrencies = [];
  public regionOid;
  public programList = [];
  disabledOtp: boolean = false;
  public programLiveExpiredList = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public validTransaction = true;
  public programSelected = true;
  public isExpiryDateRequired = false;
  txnHistoryFormGroup: FormGroup;
  manualDebitCreditForm: FormGroup;
  public searchEnquiriesForm: FormGroup;
  manualDebitCreditHistoryForm: FormGroup;
  txnRewardHistoryFormGroup: FormGroup;
  searchPersonalisedCouponsForm: FormGroup;
  searchCommunicationFormGroup: FormGroup;
  public placeHolderImgUrl = "assets/images/greybg.png";
  public filePathUrl = localStorage.getItem("imgBaseUrl");

  public selectedtxns;

  public otpData;
  public smsOtpValue: string;
  public emailOtpValue: string;

  //Enquiry
  public enquiryTypeList: any = [];
  public countries: any = [];
  public cities: any = [];
  public storeList: any = [];
  public showCountryError: boolean = false;

  status = true;
  statusTransaction = true;
  statusEnquiries = true;
  statusPersonalisedCoupons = true;
  statusCommunication = true;
  public baseAccuralSummary: any;
  public brandAccuralSummary: any;
  public baseReedemSummary: any;
  public brandReedemSummary: any;
  public txnIdValueSend;
  public programOidVal;
  private previusUrl = localStorage.getItem('previousUrl');
  public seletedTabIndex = 0;
  public sortTxnColumn = "txnDate";
  public sortTxnDirection = "desc";
  public sortTxnRewardColumn = "createdTime";
  public sortTxnRewardDirection = "desc";
  public sortEnquiryColumn = "createdTime";
  public sortEnquiryDirection = "desc";
  brandnameVal;
  public noRecords: boolean = false;
  public noRecordsTransaction: boolean = false;
  public noRecordsPoints: boolean = false;
  public noRecordsEnquiries: boolean = false;
  public noRecordsPersonalizedCoupons: boolean = false;
  public searchStoreVal: boolean = false;

  public resultsLength = 0;
  public communicationResultsLength = 0;
  public sortCommunicationColumn = "createdTime";
  public sortCommunicationDirection = "desc";
  public sortPersonalisedColumn = "createdTime";
  public sortPersonalisedDirection = "desc";
  public activityList;

  public templateTypes: any = [];

  public minExpiryDate = new Date();
  imageUrl: string;
  txnIdVal;

  public countryId;
  public countryList;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredCountries: Observable<Country[]>;

  public cityId;
  public cityList;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredCities: Observable<City[]>;

  public brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredBrands: Observable<Brand[]>;

  public storeAllList;
  Stores: Store[] = [];
  storeCtrl = new FormControl();
  filteredStores: Observable<Store[]>;

  Programs: Program[] = [];
  programCtrl = new FormControl();
  filteredPrograms: Observable<Program[]>;

  ProgramsFilter: ProgramFilter[] = [];
  programFilterCtrl = new FormControl();
  filteredFilterPrograms: Observable<ProgramFilter[]>;

  storeId: any;
  brandId: any;
  storeOid: any;
  programId: any;
  programFilterId: any;
  programFilterList: any;
  loadingResponse: boolean = false;
  pointsIndex;
  openingBalance: any;
  closingBalance: any;
  accrued: any;
  redeemed: any;
  reversed: any;
  expired: any;
  bonus: any;
  accruedBonus: any;
  CUSTOMER_PERSONA_REPORT_URL: string;
  
  constructor(private fb: FormBuilder,
    public dialog: MatDialog, private activatedRoute: ActivatedRoute,
    private https: HttpService, private snackBar: MatSnackBar, public router: Router, private renderer: Renderer2) {
    this.progress = this.emulateProgress();
    // this.activatedRoute.params.subscribe(
    //   (params) => {
    //     this.memberId = +(params.id)
    //   }
    // );
    let data = localStorage.getItem('memberCustomerId');
    this.memberId = Number(data);
    localStorage.removeItem('memberCustomerId');
    
    this.pointsIndex = localStorage.getItem('pointTabIndex');
    localStorage.removeItem('pointTabIndex');
    console.log(this.memberId)
    this.CUSTOMER_PERSONA_REPORT_URL = 'https://danbropowerbi.reciproci.com/withFilter?Report_ID=ba79ec65-6439-44ac-a2a3-931b69f4b2e2&filter=reciprocidb_rp_transaction/USER_OID%20eq%20'+this.memberId;
    console.log(this.CUSTOMER_PERSONA_REPORT_URL)
    this.buildTransactionForm();
    this.buildManualDrCrForm();
    this.buildEnquirySearchForm();
    this.buildManualDrCrHistoryForm();
    this.buildPersonalisedCouponsForm();
    this.buildCommunicationForm();
    this.getAllActivity();
    this.getAllCurrencies();
    this.getProgramsList();
    // this.getAllProgramsA();
    this.getAllFilterProgramsA();
    // this.getLiveExpiredProgramsList();
    this.buildTransactionRewardHistoryForm();
    this.searchRewardHistory();
    this.getStoreList();
    this.searchPersonalisedCoupons();
    this.searchCommunications();
    this.dataSource1 = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
    this.dataSource5 = new MatTableDataSource();
    this.dataSource7 = new MatTableDataSource();
    this.dataSource8 = new MatTableDataSource();

    if (this.previusUrl != null && ((this.previusUrl.startsWith("/view-transaction") || this.previusUrl.startsWith("/confirm-transaction-details"))) && (this.pointsIndex != 'POINTS')){
      this.seletedTabIndex = 1;
    } 
    else if (this.previusUrl != null && (this.previusUrl.startsWith("/view-transaction") && (this.pointsIndex == 'POINTS')) ) {
      this.seletedTabIndex = 2;
    }
    else if (this.previusUrl != null && this.previusUrl.startsWith("/view-enquiries")) {
      this.seletedTabIndex = 3;
    }
    else {
      this.seletedTabIndex = 0;
    }
  }


  openFilter() {
    this.status = !this.status;
    this.manualPoints = false;
  }

  openFilterTransaction(){
    this.statusTransaction = !this.statusTransaction;
  }

  openFilterEnquiries(){
    this.statusEnquiries = !this.statusEnquiries;
  }

  openPersonalisedCoupons(){
    this.statusPersonalisedCoupons = !this.statusPersonalisedCoupons;
  }

  openCommunication(){
    this.statusCommunication = !this.statusCommunication;
  }

  // manualClose(){
  //   this.manualPoints = false;
  // }

  ngOnInit() {

    if (this.memberId) {

      this.getAllEnquiryTypes();
      this.getAllCountries();
      this.getAllCountriesA();
      this.viewBasicDetails();
      this.transactionHistory();
      this.getAllBrands();
      this.getAllBrandsA();
      this.getAllStoresA();
      this.getRegionCurrency();
      this.searchEnquiry();
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
      this.dataSource7.paginator = this.paginator7;
      this.dataSource7.sort = this.sort7;
      this.dataSource8.paginator = this.paginator8;
      this.dataSource8.sort = this.sort8;

      if (this.menuIds.indexOf('7004003') > -1) {
        this.showApprovalBtn = true;
        this.updatePermission = false;
      }

      if (this.menuIds.indexOf('7004004') > -1) {
        this.showEmailApprovalBtn = true;
        this.updateEmailPermission = false;
      }
      // console.log(this.tabGroup.selectedIndex);
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-member'])
    }

  }
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    this.buildManualDrCrForm();
  }
  public buildManualDrCrForm() {
    this.manualDebitCreditForm = this.fb.group({
      // transactionType: ['', Validators.required],
      programOid: ['', Validators.required],
      transactionTypeCtrl: ['', Validators.required],
      transactionFreeProductCtrl: ['', Validators.required],
      noOfPoints: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      reason: ['OTHER_REASON', Validators.required],
      txnId: '',
      expiryDate: '',
      internalComment: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      manualDebitCreditLocale: this.fb.array([])
    });
    this.buildManualDrCrLocaleForm();
  }


  public buildManualDrCrLocaleForm() {
    const control = <FormArray>this.manualDebitCreditForm.controls['manualDebitCreditLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        description: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
      });
      control.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
    }
  }

  public buildManualDrCrHistoryForm() {
    this.manualDebitCreditHistoryForm = this.fb.group({
      txnDate: '',
      transactionId: '',
      transactionType: '',
      noOfPoints: '',
      txnStatus: '',
    })
  }

  public viewBasicDetails() {
    this.viewMemberData = true;
    this.renderer.addClass(document.body, 'viewdata-disabled');
    let body = {
      customerOid: this.memberId
    }
    let GET_BASIC_DETAILS = environment.APIEndpoint + "api/rpa/memberMgmt/v1/view";
    this.https.postJson(GET_BASIC_DETAILS, body)
      .subscribe(
        (response) => {
          this.renderer.removeClass(document.body, 'viewdata-disabled');
          this.viewMemberData = false;
          console.log(response);
          this.basicDetails = response;
          this.emailId = response["emailId"];
          this.toggleVal = response["status"] == "ACTIVE";
          this.imageUrl = response["imageUrl"];
          this.getCustomerWalletDetails();
        },
        (error) => {
          console.log(error);
          this.renderer.removeClass(document.body, 'viewdata-disabled');
          this.viewMemberData = false;
        }
      );
  }
  //   public getCampaignData() {
  //     this.campStartDate = moment(this.firstFormGroup.get('startDate').value).format('DD-MM-YYYY');
  //     this.campEndDate = moment(this.firstFormGroup.get('endDate').value).format('DD-MM-YYYY');

  //     let d1 = new Date(this.firstFormGroup.get('startDate').value);
  //     let d2 = new Date(this.firstFormGroup.get('endDate').value);

  //     this.dateError = d1 > d2 ? true : false;
  // }


  public getCustomerWalletDetails() {
    let body = {
      customerOid: this.memberId,
      regionOid: this.regionOid
    }
    let GET_CUSTOMER_WALLET_DTLS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/customerWalletBalance";
    this.https.postJson(GET_CUSTOMER_WALLET_DTLS, body)
      .subscribe(
        (response) => {
          this.customerWalletDtls = response;
          console.log(this.customerWalletDtls);
          this.pointDataSource = new MatTableDataSource(this.customerWalletDtls);

        });
  }
  public buildTransactionForm() {
    this.txnHistoryFormGroup = this.fb.group({
      txnId: ["", Validators.pattern("[a-zA-Z0-9 ]*")],
      txnType: '',
      brandOid: '',
      storeOid: '',
      txnStatus: '',
      billAmount: '',
      paymentMethod: '',
      txnDate: '',
      txnSearchVal: [""]
    })
  }

  public buildTransactionRewardHistoryForm() {
    this.txnRewardHistoryFormGroup = this.fb.group({
      txnOid: '',
      txnType: '',
      programOid: '',
      startDate: '',
      endDate: '',
      SearchVal: []
    })
  }

  resetRewardHistory() {
    this.programFilterCtrl.clearValidators();
    this.programFilterCtrl.reset('');
    this.programFilterCtrl.updateValueAndValidity();
    this.programFilterId = '';
    this.ProgramsFilter = [];

    this.txnRewardHistoryFormGroup.get('startDate').clearValidators();
    this.txnRewardHistoryFormGroup.get('startDate').setValue('');
    this.txnRewardHistoryFormGroup.get('startDate').updateValueAndValidity();

    this.txnRewardHistoryFormGroup.get('endDate').clearValidators();
    this.txnRewardHistoryFormGroup.get('endDate').setValue('');
    this.txnRewardHistoryFormGroup.get('endDate').updateValueAndValidity();
    // this.buildRewardHistoryForm();
    this.getAllFilterProgramsA();
    this.searchRewardHistory();
  }

  resetTransactionRewardHistory(){
    this.txnRewardHistoryFormGroup.get('txnOid').clearValidators();
    this.txnRewardHistoryFormGroup.get('txnOid').setValue('');
    this.txnRewardHistoryFormGroup.get('txnOid').updateValueAndValidity();

    this.txnRewardHistoryFormGroup.get('txnType').clearValidators();
    this.txnRewardHistoryFormGroup.get('txnType').setValue('');
    this.txnRewardHistoryFormGroup.get('txnType').updateValueAndValidity();
    this.searchRewardHistory();
  }

  public transactionHistory() {
    this.searchStoreVal = true;
    let formdata = this.txnHistoryFormGroup.value;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortTxnColumn,
        "dir": this.sortTxnDirection
      },
      "keySearch": formdata.txnSearchVal,
      "fieldSearch": [
        {
          "fieldName": "userOid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "txnId",
          "fieldValue": formdata.txnId
        },
        {
          "fieldName": "txnType",
          "fieldValue": formdata.txnType
        },
        {
          "fieldName": "brandOid",
          "fieldValue": null != this.brandId ? this.brandId : ''
        },
        {
          "fieldName": "storeOid",
          "fieldValue": null != this.storeOid ? this.storeOid : ''
        },
        {
          "fieldName": "billAmount",
          "fieldValue": formdata.billAmount
        },
        {
          "fieldName": "txnStatus",
          "fieldValue": formdata.txnStatus
        },
        {
          "fieldName": "paymentMethod",
          "fieldValue": formdata.paymentMethod
        },
        {
          "fieldName": "fromDate",
          "fieldValue": null != formdata.txnDate && formdata.txnDate != '' ? moment(formdata.txnDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "toDate",
          "fieldValue": null != formdata.txnDate && formdata.txnDate != '' ? moment(formdata.txnDate).format('YYYY-MM-DD') : ''
        }
      ]
    }
    console.log(data);

    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberMgmt/v1/getTransactionHistory', data)
      .subscribe(
        (res) => {
          this.searchStoreVal = false;
          this.dataSource3 = new MatTableDataSource(res["items"]);
          this.dataSource3.sort = this.sort;
          this.txnHistoryLength = res["totalCount"];
          console.log(this.dataSource3);
          console.log(this.txnHistoryLength);
          if (this.txnHistoryLength == 0) {
            this.noRecordsTransaction = true;
          } else {
            this.noRecordsTransaction = false;
          }
          if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.txnHistoryLength) {
            this.paginationData.pageIndex = 0;
            this.paginator1.pageIndex = 0;
            this.transactionHistory();
          }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
  }

  public getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        console.log(response);
        this.brandList = response;
        this.brandList.forEach(brand => {
          if (brand.brandId == this.txnHistoryFormGroup.get('brandOid').value) {
            this.brandnameVal = brand.brandName;
            console.log(this.brandnameVal);
          }
        });
      })
  }

  getAllBrandsA() {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_CITIES)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;
        console.log(this.brandList);

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objbrandkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          // console.log(objbrandkey);
          this.Brands.push(objbrandkey);
        }
        this.filteredBrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }

  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllStoresA() {
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": ""
        },

      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(response => {
      console.log(response);
      this.storeAllList = response["items"];
      console.log(this.storeAllList);

      for (let i = 0; i <= this.storeAllList.length - 1; i++) {
        let objbrandkey = {
          storeOid: this.storeAllList[i]['storeOid'],
          storeName: this.storeAllList[i]['storeName'],
        }
      //  console.log(objbrandkey);
        this.Stores.push(objbrandkey);
      }
      this.filteredStores = this.storeCtrl.valueChanges
        .pipe(
          startWith(''),
          map(store => store ? this._filterStores(store) : this.Stores.slice())
        );
    },
      (error) => {
        console.log(error);
      });
  }

  private _filterStores(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.Stores.filter(store => store.storeName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllBrand(brandId) {
    this.brandId = brandId;
    console.log(this.brandId);
  }

  getAllStore(storeOid) {
    this.storeOid = storeOid;
    console.log(this.storeId);
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getTxnHistoryUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.transactionHistory();
  }

  toggle() {
    this.manualPoints = !this.manualPoints;

    if (this.manualPoints) {
      this.status = true;
    }
  }

  emulateProgress() {
    return new Observable<number>(observer => {
      let val = 0;
      const interval = setInterval(() => {
        if (val < 100) {
          val++;
        } else {
          val = 0;
        }

        observer.next(val);
      }, 100);

      return () => {
        clearInterval(interval);
      };
    });
  }

  profileCompletionVar: number = 50;

  countDownOTP: number = 180;
  interval;

  countDown;
  public counter = 10;
  tick = 1000;

  startTimerOtp() {
    // this.countVal = true;
    this.counter = 180;
    this.disabledOtp = true;
    this.countDown = Observable.timer(0, this.tick).take(this.counter).map(
      (res) =>
        --this.counter
    )
    // if (this.counter == 0) {
    //   this.disabledOtp = false;
    //   console.log(this.disabledOtp);
    // }
    // console.log(this.counter);

  }

  countDownEmail;
  // countDownEmailVal;
  countDownEmailVal = 181;
  tickCount = 1000;

  startTimerEmail() {
    // this.val = setInterval(() => {
    //   if (this.countDownEmail > 0) {
    //     this.countDownEmail--;
    //   }
    //   // else {
    //   //   this.countDownEmail = 60;
    //   // }
    // }, 1000)
    this.countDownEmail = Observable.timer(0, this.tickCount)
      .take(this.countDownEmailVal)
      .map(() => --this.countDownEmailVal)
  }

  openEditProfileDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent);
    dialogRef.componentInstance.basicDetails = this.basicDetails;
    dialogRef.afterClosed().subscribe(result => {
      this.viewBasicDetails();
    });

  }
  openEditMemberDialog() {
    const dialogRef = this.dialog.open(EditMemberDialogComponent);
    dialogRef.componentInstance.basicDetails = this.basicDetails;
    dialogRef.afterClosed().subscribe(result => {
      this.viewBasicDetails();
    });
  }
  openAddTransactionDialog() {
    const dialogRef = this.dialog.open(AddTransactionDialogComponent);
    dialogRef.componentInstance.customerOid = this.memberId;
  }
  openSendVerificationDialog() {
    if (this.emailId != "" && this.emailId != null) {
      const dialogRef = this.dialog.open(SendVerificationDialogComponent);
      this.sendOtp('EMAIL')
    } else {
      const dialogRefe = this.dialog.open(SendEmailVerificationErrorComponent);
    }
  }
  openSendOtpDialog() {
    const dialogRef = this.dialog.open(SendOtpDialogComponent);
    this.sendOtp('SMS');
  }
  openExtenedExpiryDialog(loyaltyBrandOid: any, reedemType: any,freeProductType:any) {
    const dialogRef = this.dialog.open(ExtendedExpiryDialogComponent);
    dialogRef.componentInstance.customerOid = this.memberId;
    dialogRef.componentInstance.loyaltyBrandOid = loyaltyBrandOid;
    dialogRef.componentInstance.reedemType = reedemType;
    dialogRef.componentInstance.freeProductType = freeProductType;
  }

  openChangeHistoryDialog() {
    const dialogRef = this.dialog.open(ChangeHistoryDialogComponent);
    dialogRef.componentInstance.memberId = this.memberId;
  }
  // openTransactionDialog() {
  //   const dialogRef = this.dialog.open(TransactionDialogComponent);
  // }
  openSearchTxnIdDialog() {
    const dialogRef = this.dialog.open(SearchTransactionIdDialogComponent);
  }

  public getAllCurrencies() {
    let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    this.https.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
      .subscribe((response) => {
        this.currencies = response;

      })
  }

  getRegionCurrency() {
    let GET_REGION_CURRENCIES_AND_TIERS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
    this.https.getJson(GET_REGION_CURRENCIES_AND_TIERS).subscribe((response) => {
      this.regionCurrencies = response['regionList'].map(function (item) {
        let region = {
          regionId: item.regionId,
          currencyCode: item.currencyCode,

        }
        return region;
      })
    })
  }

  public getCustomerWallet(regionOid) {
    this.regionOid = regionOid;
    this.getCustomerWalletDetails();
  }

  getProgramsList() {
    this.https.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE')

      .subscribe(
        (response) => {
          this.programList = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getAllProgramsA() {
    let GET_ALL_PROGRAM = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE";
    this.https.getJson(GET_ALL_PROGRAM)
      .subscribe((response) => {
        console.log(response);
        this.programList = [];
        this.Programs = [];
        this.programList = response;
        for (let i = 0; i <= this.programList.length - 1; i++) {
          let objMallkey = {
            programId: this.programList[i]['programId'],
            programName: this.programList[i]['programName'],
          }
          // console.log(objMallkey);
          this.Programs.push(objMallkey);
        }
        this.filteredPrograms = this.programCtrl.valueChanges
          .pipe(
            startWith(''),
            map(program => program ? this._filterPrograms(program) : this.Programs.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterPrograms(value: string): Program[] {
    const filterValue = value.toLowerCase();
    return this.Programs.filter(program => program.programName.toLowerCase().indexOf(filterValue) === 0);
  }


  getAllFilterProgramsA() {
    let GET_ALL_PROGRAM = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE";
    this.https.getJson(GET_ALL_PROGRAM)
      .subscribe((response) => {
        console.log(response);
        this.programFilterList = [];
        this.ProgramsFilter = [];
        this.programFilterList = response;
        for (let i = 0; i <= this.programFilterList.length - 1; i++) {
          let objMallkey = {
            programId: this.programFilterList[i]['programId'],
            programName: this.programFilterList[i]['programName'],
          }
          // console.log(objMallkey);
          this.ProgramsFilter.push(objMallkey);
        }
        this.filteredFilterPrograms = this.programFilterCtrl.valueChanges
          .pipe(
            startWith(''),
            map(program => program ? this._filterPrograms(program) : this.ProgramsFilter.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterFilterPrograms(value: string): ProgramFilter[] {
    const filterValue = value.toLowerCase();
    return this.ProgramsFilter.filter(program => program.programName.toLowerCase().indexOf(filterValue) === 0);
  }
  getAllProgram(programOid) {
    this.programId = programOid;
  }

  getAllProgramFilter(programFilterOid) {
    this.programFilterId = programFilterOid;
  }

  // getLiveExpiredProgramsList() {
  //   this.https.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE,EXPIRED')

  //     .subscribe(
  //       (response) => {
  //         this.programLiveExpiredList = response;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }
  public changeExpiryDateRequiredValidation(brandId, TranactionId) {
    console.log(brandId);

    console.log(brandId.rewardType);
    console.log(TranactionId);
    this.manualDebitCreditForm.get('transactionTypeCtrl').reset();
    this.isExpiryDateRequired = false;
    this.selectedBrandId = brandId.brandOid;
    var programOid = this.manualDebitCreditForm.get('programOid').value;
    var txnType = this.manualDebitCreditForm.get('transactionTypeCtrl').value;
    var programType = '';
    for (let i = 0; i < this.programList.length; i++) {
      if (this.programList[i].programId == programOid) {
        programType = this.programList[i].programType;
        break;
      }
    }
    this.programSelected = false;
    // if (null != programType && programType != 'BASE' && txnType == 'CREDIT') {
    //   this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
    //   this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    //   this.isExpiryDateRequired = true;
    // } else {
    //   this.manualDebitCreditForm.get('expiryDate').clearValidators();
    //   this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    //   this.manualDebitCreditForm.get('expiryDate').setValue('');
    //   this.isExpiryDateRequired = false;
    // }
    // if (brandId.rewardType == 'POINTS' &&
    //   TranactionId == 'CREDIT' &&
    //   brandId.rewardType != 'STAMPS' &&
    //   TranactionId != 'DEBI')

    if (brandId.rewardType =='POINTS' || brandId.rewardType!='STAMPS'  || brandId.rewardType=='BASEREWARD' && TranactionId != 'CREDIT'){
      this.isExpiryDateRequired = true;
      this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    }
    else{
      this.isExpiryDateRequired = false;
       this.manualDebitCreditForm.get('expiryDate').clearValidators();
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      this.manualDebitCreditForm.get('expiryDate').setValue('');
    }

    if (brandId.rewardType != 'POINTS' &&
      TranactionId == 'CREDIT' &&
      TranactionId != 'DEBIT') {
      this.freeProductVal = true;
      // this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
      // this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      // this.isExpiryDateRequired = true;
    } else {
      this.freeProductVal = false;
      // this.manualDebitCreditForm.get('expiryDate').clearValidators();
      // this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      // this.manualDebitCreditForm.get('expiryDate').setValue('');
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').clearValidators();
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').updateValueAndValidity();
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').setValue('');
      // this.isExpiryDateRequired = false;
    }
    if (brandId.rewardType != undefined) {
      this.disableValuetxns = false;
    } else {
      this.disableValuetxns = true;
    }
  }
  changeTranactionType(TranactionId, brandId) {
    this.selectedrewardTypeVal = TranactionId.rewardType;
    console.log(this.selectedrewardTypeVal);

    this.transactionTypeVal = brandId;
    console.log(this.transactionTypeVal);

    if (this.transactionTypeVal == 'CREDIT') {
      this.isExpiryDateRequired = true;
      this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    }
    else if (this.transactionTypeVal == 'DEBIT'){
      this.isExpiryDateRequired = false;
      this.manualDebitCreditForm.get('expiryDate').clearValidators();
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      this.manualDebitCreditForm.get('expiryDate').setValue('');
    }
    //   if (this.selectedrewardTypeVal == 'POINTS' &&
    //   this.transactionTypeVal == 'CREDIT' &&
    //    this.selectedrewardTypeVal == 'STAMPS' &&
    //   this.transactionTypeVal != 'DEBI'
    // )
    // if (this.selectedrewardTypeVal != 'POINTS' &&
    //   this.transactionTypeVal == 'CREDIT' &&
    //   this.transactionTypeVal != 'DEBIT'
    // ) {
    //   this.freeProductVal = true;
    //   // this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
    //   // this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    //   this.isExpiryDateRequired = true;
    // }
    // if (this.selectedrewardTypeVal == 'POINTS' ||
    // this.selectedrewardTypeVal == 'STAMPS' ||
    // this.selectedrewardTypeVal == 'BASEREWARD' && this.transactionTypeVal == 'CREDIT')
    // {
    //   this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
    //   this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    //   this.isExpiryDateRequired = true;
    // }
    // else{
    //   this.isExpiryDateRequired = false;
    //   this.manualDebitCreditForm.get('expiryDate').clearValidators();
    //   this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    //   this.manualDebitCreditForm.get('expiryDate').setValue('');
    // }
    if (this.selectedrewardTypeVal == 'STAMPS' && this.transactionTypeVal == '!DEBIT'
      || this.selectedrewardTypeVal == 'STAMPS' && this.transactionTypeVal == 'CREDIT') {
      console.log("Test");
      this.freeProductVal = true;
      // this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
      // this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      // this.isExpiryDateRequired = true;
    }
    else {
      this.freeProductVal = false;
      // this.manualDebitCreditForm.get('expiryDate').clearValidators();
      // this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      // this.manualDebitCreditForm.get('expiryDate').setValue('');
      // this.isExpiryDateRequired = false;
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').clearValidators();
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').updateValueAndValidity();
      this.manualDebitCreditForm.get('transactionFreeProductCtrl').setValue('');
      this.dataValue = 'Points';
    }
    if (this.selectedrewardTypeVal == 'STAMPS' && this.transactionTypeVal == 'DEBIT'){
      this.dataValue = 'Free Product';
    }
  }



  changetransactionFreeProduct(FreeProductValue) {
    console.log(FreeProductValue);
    this.FreeProductValueSelection = FreeProductValue;
    if (this.FreeProductValueSelection == 'FREE_PRODUCT') {
      this.dataValue = 'Free Product';
      this.isExpiryDateRequired = true;
      this.manualDebitCreditForm.get('expiryDate').setValidators([Validators.required]);
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
    }
    else if (this.FreeProductValueSelection == 'STAMPS') {
      this.dataValue = 'Stamps';
      this.manualDebitCreditForm.get('expiryDate').clearValidators();
      this.manualDebitCreditForm.get('expiryDate').updateValueAndValidity();
      this.manualDebitCreditForm.get('expiryDate').setValue('');
      this.isExpiryDateRequired = false;
    }
  }
  public disableBtnValue: boolean = false;
  addManualCreditDebit() {
    console.log(this.transactionTypeVal);
    let formdata = this.manualDebitCreditForm.value;
    console.log(formdata);
    
    if (this.manualDebitCreditForm.invalid == true) {
      console.log("error");
      this.disableBtnValue = false;

    } else {

      if(this.selectedrewardTypeVal=='STAMPS' && this.transactionTypeVal == 'DEBIT'){
        this.FreeProductValueSelection = 'FREE_PRODUCT';
      }

      this.loadingResponse = true;
      this.disableBtnValue = true;
      let formdata = this.manualDebitCreditForm.value;
      this.pointFormSumited = true;
      let locales = [];
      formdata.manualDebitCreditLocale.forEach((locale, index) => {
        locales.push({
          description: locale.description,
          langOid: this.languageList[index].languageId
        })
      })
      this.programOidVal = formdata.programOid['programId'];
      let body = {
        memberId: this.memberId,
        transactionType: this.transactionTypeVal,
        fnbCreditDebitType: this.FreeProductValueSelection != '' ? this.FreeProductValueSelection : '',
        programOid: this.programOidVal,
        txnId: formdata.txnId,
        reason: formdata.reason,
        noOfPoints: formdata.noOfPoints,
        expiryDate: null != formdata.expiryDate && formdata.expiryDate != '' ? moment(formdata.expiryDate).format('YYYY-MM-DD') : '',
        internalComment: formdata.internalComment,
        debitCreditPointsLocales: locales,
      }
      console.log(body);
      let MANUAL_CREDIT_DEBIT_URL = environment.APIEndpoint + "api/rpa/memberTransactions/v1/manualDebitCredit";
      this.https.postJson(MANUAL_CREDIT_DEBIT_URL, body)
        .subscribe((response) => {
          this.loadingResponse = false;
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Points updated successfully"
            }
          });
          this.searchRewardHistory();
          this.getCustomerWalletDetails();
          this.pointFormSumited = false;
          this.buildManualDrCrForm();
          this.manualPoints = !this.manualPoints;
          this.disableBtnValue = false;
        }
          , err => {
            this.disableBtnValue = false;
            console.log(err.error);
            this.loadingResponse = false;
            console.log("error Status = " + err);
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }

          });
    }
  }


  public getPointsDetails(){
    let formdata = this.txnRewardHistoryFormGroup.value;
    console.log(formdata)
    let requestbodyRewardPoints  = {
      userOid : this.memberId,
      startDate : null != formdata.startDate && formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : '',
      endDate : null != formdata.endDate && formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : '',
      programOid : null != this.programFilterId ? this.programFilterId : ''
  }
 
this.https.postJson(environment.APIEndpoint + 'api/rpa/memberTransactions/v1/getRewardSummary', requestbodyRewardPoints)
  .subscribe(
    (res) => {
      console.log(res);
      this.openingBalance = res['openingBalance'];
      this.closingBalance = res['closingBalance'];
      this.accrued = res["accrued"];
      console.log(this.baseAccuralSummary);
      this.redeemed = res["redeemed"];
      this.reversed = res["reversed"];
      this.expired = res["expired"];
      this.bonus = res["bonus"];
      this.accruedBonus = this.accrued + this.bonus;
    },
    (err) => {
      console.log(err)
    });
  }

  public searchRewardTransactionHistory() {
    let formdata = this.txnRewardHistoryFormGroup.value;
    console.log(formdata)
    this.searchStoreVal = true;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortTxnRewardColumn,
        "dir": this.sortTxnRewardDirection
      },
      "keySearch": formdata.SearchVal,
      "fieldSearch": [
        {
          "fieldName": "txnId",
          "fieldValue": null != formdata.txnOid ? formdata.txnOid : null
        },
        {
          "fieldName": "txnType",
          "fieldValue": null != formdata.txnType ? formdata.txnType : null
        }    
      ]
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberTransactions/v1/getRewardHistory', data)
      .subscribe(
        (res) => {
          console.log(res);

          this.searchStoreVal = false;
          this.dataSource5 = new MatTableDataSource(res["items"]);
          this.dataSource5.sort = this.sort;
          this.txnRewardHistoryLength = res["totalCount"]
          if (this.txnRewardHistoryLength == 0) {
            this.noRecordsPoints = true;
          } else {
            this.noRecordsPoints = false;
          }
          if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.txnRewardHistoryLength) {
            this.paginationData.pageIndex = 0;
            this.paginator2.pageIndex = 0;
            this.searchRewardTransactionHistory();
          }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
      }


  public searchRewardHistory() {
    let formdata = this.txnRewardHistoryFormGroup.value;
    this.searchStoreVal = true;
    
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortTxnRewardColumn,
        "dir": this.sortTxnRewardDirection
      },
      "keySearch": formdata.SearchVal,
      "fieldSearch": [
        {
          "fieldName": "userOid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "txnId",
          "fieldValue": null != formdata.txnOid ? formdata.txnOid : null
        },
        {
          "fieldName": "txnType",
          "fieldValue": null != formdata.txnType ? formdata.txnType : null
        },
        {
          "fieldName": "startDate",
          "fieldValue": null != formdata.startDate && formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "endDate",
          "fieldValue": null != formdata.endDate && formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "programOid",
          "fieldValue": null != this.programFilterId ? this.programFilterId : ''
        }
      ]
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberTransactions/v1/getRewardHistory', data)
      .subscribe(
        (res) => {
          console.log(res);

          this.searchStoreVal = false;
          this.dataSource5 = new MatTableDataSource(res["items"]);
          this.dataSource5.sort = this.sort;
          this.txnRewardHistoryLength = res["totalCount"]
          if (this.txnRewardHistoryLength == 0) {
            this.noRecordsPoints = true;
          } else {
            this.noRecordsPoints = false;
          }
          if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.txnRewardHistoryLength) {
            this.paginationData.pageIndex = 0;
            this.paginator2.pageIndex = 0;
            this.searchRewardHistory();
            this.getPointsDetails();
            this.searchRewardTransactionHistory();
          }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
  }

  

  //Enquiry

  getAllEnquiryTypes() {

    let GET_ALL_ENQUIRY_TYPES = environment.APIEndpoint + "api/rpa/master/enquiry/type/v1/get/list";
    this.https.getJson(GET_ALL_ENQUIRY_TYPES)
      .subscribe((response) => {

        this.enquiryTypeList = response;
        this.enquiryTypeList.sort((a, b) => a.enquiryTitle.localeCompare(b.enquiryTitle));
      },
        (error) => {
          console.log(error);
        })
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
      })
  }

  getAllCities(countryId) {
    if (countryId == undefined || countryId == '') {
      //    this.showCountryError=true;
    } else {
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
      this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
        .subscribe((response) => {
          this.cities = response;
          this.showCountryError = false;
        })
    }
  }

  getAllCountriesA() {
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        // console.log(response);
        this.countryList = [];
        this.Countries = [];
        this.countryList = response;
        for (let i = 0; i <= this.countryList.length - 1; i++) {
          let objMallkey = {
            countryId: this.countryList[i]['countryId'],
            countryName: this.countryList[i]['countryName'],
          }
          // console.log(objMallkey);
          this.Countries.push(objMallkey);
        }
        this.filteredCountries = this.countryCtrl.valueChanges
          .pipe(
            startWith(''),
            map(country => country ? this._filterCountries(country) : this.Countries.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
  }


  getAllCitiesA(countryId) {
    console.log(countryId);
    this.cityId = '';
    this.cityCtrl.reset('');
    this.cityList = [];
    if (countryId != undefined || countryId != '') {
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
      this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
        .subscribe((response) => {
          console.log(response);
          this.cityList = [];
          this.Cities = [];
          this.cityList = response;
          for (let i = 0; i <= this.cityList.length - 1; i++) {
            let objMallkey = {
              cityId: this.cityList[i]['cityId'],
              cityName: this.cityList[i]['cityName'],
            }
            // console.log(objMallkey);
            this.Cities.push(objMallkey);
          }
          this.filteredCities = this.cityCtrl.valueChanges
            .pipe(
              startWith(''),
              map(city => city ? this._filterCities(city) : this.Cities.slice())
            );
        },
          (error) => {
            console.log(error);
          });
    }
  }
  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllcountry(countryId) {
    this.countryId = countryId;
    console.log(this.countryId);
  }

  getAllcity(countryId) {
    this.cityId = countryId;
    console.log(this.cityId);
  }


  isCountrySelected(country) {
    if (country == undefined || country == '')
      this.showCountryError = true;
    else
      this.showCountryError = false
  }

  public buildEnquirySearchForm() {
    this.searchEnquiriesForm = this.fb.group({
      referenceId: [],
      enquiryType: [],
      country: [],
      city: [],
      startDate: [],
      endDate: [],
      enquiryStatus: [],
      searchVal: []
    })
  }

  searchEnquiry() {
    let formdata = this.searchEnquiriesForm.value;
    this.searchStoreVal = true;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortEnquiryColumn,
        "dir": this.sortEnquiryDirection
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "userOid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "oid",
          "fieldValue": null != formdata.referenceId ? formdata.referenceId : ''
        },
        {
          "fieldName": "enquiryType.oid",
          "fieldValue": null != formdata.enquiryType ? formdata.enquiryType : ''
        },
        {
          "fieldName": "countryOid",
          "fieldValue": null != this.countryId ? this.countryId : ''
        },
        {
          "fieldName": "cityOid",
          "fieldValue": null != this.cityId ? this.cityId : ''
        },
        {
          "fieldName": "fromDate",
          "fieldValue": null != formdata.startDate && formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "toDate",
          "fieldValue": null != formdata.endDate && formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "enquiryStatus",
          "fieldValue": null != formdata.enquiryStatus ? formdata.enquiryStatus : ''
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/enquiry/v1/search', data).subscribe(res => {
      this.searchStoreVal = false;
      this.enquiryResultsLength = res["totalCount"];
      if (this.enquiryResultsLength == 0) {
        this.noRecordsEnquiries = true;
      } else {
        this.noRecordsEnquiries = false;
      }
      this.dataSource2 = new MatTableDataSource(res["items"]);
      //this.dataSource2.sort = this.sort2;
    console.log(this.dataSource2);
      if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.enquiryResultsLength) {
        this.paginationData.pageIndex = 0;
        this.paginator3.pageIndex = 0;
        this.searchEnquiry();
      }
    }, err => {
      console.log(err);
      this.searchStoreVal = false;
    })
  }

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchEnquiry();
  }

  resetTransaction() {
    this.brandCtrl.reset('');
    this.brandId = '';
    this.Brands = [];
    this.brandId = '';
    this.storeCtrl.reset('');
    this.storeOid = '';
    this.Stores = [];
    this.buildTransactionForm();
    this.transactionHistory();
    this.getAllBrandsA();
    this.getAllStoresA();
  }

  resetEnquiryForm() {

    this.showCountryError = false;
    this.countries = [];
    this.cityCtrl.reset('');
    this.cities = [];
    this.cityId = '';
    this.countryCtrl.reset('');
    this.countryId = '';
    this.enquiryTypeList = [];
    this.getAllCountries();
    this.buildEnquirySearchForm();
    this.searchEnquiry();
    this.getAllEnquiryTypes();
  }
  resetpersonalisedCouponsform() {
    this.brandCtrl.reset('');
    this.brandId = '';
    this.Brands = [];
    this.noRecords = false;
    this.buildPersonalisedCouponsForm();
    this.searchPersonalisedCoupons();
  }
  public changeValidation() {
    let formdata = this.manualDebitCreditForm.value;
    formdata.reason == 'OTHER_REASON' == true
    if (null != formdata.reason && formdata.reason == 'VOID_TRANSACTION') {
      this.validTransaction = false;
    } else {
      this.manualDebitCreditForm.get('txnId').clearValidators();
      this.manualDebitCreditForm.get('txnId').setValue('');
      this.manualDebitCreditForm.get('txnId').updateValueAndValidity();
      this.validTransaction = true;
    }
  }


  // verifyTransaction() {
  //   let formdata = this.manualDebitCreditForm.value;

  //   let data = {
  //     customerOid: this.memberId,
  //     txnId: formdata.txnId
  //   }


  //   this.https.postJson(environment.APIEndpoint + 'api/rpa/memberTransactions/v1/validateTransaction', data)
  //     .subscribe((response) => {
  //       this.validTransaction = true;
  //       this.snackBar.openFromComponent(SnackBarComponent, {
  //         duration: 10000,
  //         data: {
  //           status: "success",
  //           message: "Valid Transaction"
  //         }
  //       });

  //     }, err => {
  //       console.log("error Status = " + err);
  //       this.validTransaction = false;
  //       if (err.error.errorType == 'VALIDATION') {
  //         this.snackBar.openFromComponent(SnackBarComponent, {
  //           duration: 10000,
  //           data: {
  //             status: "failure",
  //             message: err.error.errorDetails[0].description
  //           }
  //         });
  //       } else {
  //         this.snackBar.openFromComponent(SnackBarComponent, {
  //           duration: 10000,
  //           data: {
  //             status: "failure",
  //             message: "Your request cannot be saved at this time. Please try again later"
  //           }
  //         });
  //       }

  //     });
  // }


  public toggleCustomerStatus(event) {
    var status = 'ACTIVE';

    if (event.checked) {
      status = 'ACTIVE';
    } else {
      status = 'INACTIVE';
    }

    let data = {
      customerOid: this.memberId,
      status: status
    }

    this.https.postJson(environment.APIEndpoint + "api/rpa/memberMgmt/v1/updateStatus", data)
      .subscribe((response) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1000,
          data: {
            status: "success",
            message: "Customer Profile have been updated successfully"
          }
        });
      }
        , err => {
          console.log("error Status = " + err);
          if (err.error.errorType == 'VALIDATION') {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.errorDetails[0].description
              }
            });
          } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Your request cannot be saved at this time. Please try again later"
              }
            });
          }
        });


  }

  getStoreList() {
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": ""
        },

      ]
    }


    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      this.storeList = res["items"];
    }, err => {
      console.log(err)
    })
  }

  sortTxnData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortTxnColumn = "txnDate";
      this.sortTxnDirection = "desc";
    } else {
      this.sortTxnColumn = sort.active;
      this.sortTxnDirection = sort.direction;
    }

    this.transactionHistory();
  }

  sortTxnRewardData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortTxnRewardColumn = "createdTime";
      this.sortTxnRewardDirection = "desc";
    } else {
      this.sortTxnRewardColumn = sort.active;
      this.sortTxnRewardDirection = sort.direction;
    }

    this.searchRewardHistory();
  }

  sortEnquiryData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortEnquiryColumn = "createdTime";
      this.sortEnquiryDirection = "desc";
    } else {
      this.sortEnquiryColumn = sort.active;
      this.sortEnquiryDirection = sort.direction;
    }

    this.searchEnquiry();
  }

  openManualTxnDialog(value) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      txnOid: value
    }
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(ManualTxnViewDialogComponent, dialogConfig);
  }

  openAddEnquiryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      customerOid: this.memberId
    }
    const dialogRef = this.dialog.open(AddEnquiryDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.searchEnquiry();
    });
  }

  selectTransactionDialog() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(SelectTransactionDialogComponent, {
      panelClass: 'custom-modal-tranactions'
    });
    dialogRef.componentInstance.memberId = this.memberId;
    dialogRef.componentInstance.selectedBrandId = this.selectedBrandId;
    let txnId = this.manualDebitCreditForm.get('txnId');
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.txnIdVal = result.tableData.length;
          this.validTransaction = true;
          console.log(this.txnIdVal);
          console.log(result.tableData);
          console.log(result.tableData[0].transactionId);
          txnId.setValue(result.tableData[0].oid);
          txnId.updateValueAndValidity();
          this.txnIdValueSend = result.tableData.filter((item) => {
            console.log(item);
            this.selectedtxns = item.transactionId;
            if (this.selectedtxns) {
              this.editTxn = true;
            }
            return item.checked = true;
          });

          // console.log(this.txnIdValueSend);
          // let txnIDValue = result.tableData[0].transactionId;
          // this.selectedtxns.push(txnIDValue);
          // const arrrayTemp = this.selectedtxns;
          // this.selectedtxns = Array.from(new Set(arrrayTemp));
        }
      }
    );
  }

  public buildPersonalisedCouponsForm() {
    this.searchPersonalisedCouponsForm = this.fb.group({
      searchVal: [''],
      couponId: [''],
      couponTitle: [''],
      couponState: [''],
      startDate: [''],
      brand: [''],
      endDate: [''],
      status: [''],
    })
  }

  searchPersonalisedCoupons() {
    this.searchStoreVal = true;
    let formdata = this.searchPersonalisedCouponsForm.value;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortPersonalisedColumn,
        "dir": this.sortPersonalisedDirection
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "user.oid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "coupon.oid",
          "fieldValue": null != formdata.couponId ? formdata.couponId : ''
        },
        {
          "fieldName": "couponTitle",
          "fieldValue":  null != formdata.couponTitle ? formdata.couponTitle : ''
        },
        {
          "fieldName": "couponStatus",
          "fieldValue":  null != formdata.couponState ? formdata.couponState : ''
        },
        {
          "fieldName": "coupon.startDate",
          "fieldValue": null != formdata.startDate && formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "coupon.endDate",
          "fieldValue": null != formdata.endDate && formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "brandOid",
          "fieldValue": null != formdata.brand ? formdata.brand : ''
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberTransactions/v1/memberCouponSearch', data).subscribe(res => {
      this.searchStoreVal = false;
      this.dataSource7 = new MatTableDataSource(res["items"]);
      this.dataSource7.sort = this.sort7;
      this.resultsLength = res["totalCount"]
      if (this.resultsLength == 0) {
        this.noRecordsPersonalizedCoupons = true;
      } else {
        this.noRecordsPersonalizedCoupons = false;
      }
      if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
        this.paginationData.pageIndex = 0;
        this.paginator7.pageIndex = 0;
        this.searchPersonalisedCoupons();
      }
    }, err => {
      console.log(err);
      this.searchStoreVal = true;
    })
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortPersonalisedColumn = "modifiedTime";
      this.sortPersonalisedDirection = "desc";
    } else {
      this.sortPersonalisedColumn = sort.active;
      this.sortPersonalisedDirection = sort.direction;
    }
    this.searchPersonalisedCoupons();
  }

  resetPersonalisedCouponsForm() {
    this.buildPersonalisedCouponsForm();
    this.searchPersonalisedCoupons();
  }

  getMemberCouponUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchPersonalisedCoupons();
  }

  public sendOtp(templateType) {
    this.templateTypes = [];
    this.templateTypes.push(templateType);
    let requestBody = {
      customerOid: this.memberId,
      templateTypes: this.templateTypes
    }
    let SEND_OTP = environment.APIEndpoint + "api/rpa/memberMgmt/v1/sendVerifyOtp";
    this.https.postJson(SEND_OTP, requestBody)
      .subscribe(
        (response) => {
          console.log(response);
          this.otpData = response;
          if (templateType == 'SMS') {
            this.smsOtpValue = this.otpData['otp'];
            console.log("this.smsOtpValue..fff.............." + this.smsOtpValue);
          } else if (templateType == 'EMAIL') {
            this.emailOtpValue = this.otpData['otp'];
            console.log("this.emailOtpValue..fff.............." + this.emailOtpValue);
          }
        });
  }


  public getAllActivity() {
    let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/activity/list";
    this.https.getJson(GET_ACTIVITY_LIST)
      .subscribe((response) => {
        console.log(response);
        this.activityList = response;
      })
  }


  public buildCommunicationForm() {
    this.searchCommunicationFormGroup = this.fb.group({
      searchVal: [''],
      campaignId: [''],
      campaignTitle: [''],
      communicationType: [''],
      startDate: [''],
      endDate: [''],
      activityId: [''],
      status: [''],
    })
  }

  searchCommunications() {
    let formdata = this.searchCommunicationFormGroup.value;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortCommunicationColumn,
        "dir": this.sortCommunicationDirection
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "userOid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "campaign.oid",
          "fieldValue": null != formdata.campaignId ? formdata.campaignId : ''
        },
        {
          "fieldName": "campaign.campaignName",
          "fieldValue": formdata.campaignTitle
        },
        {
          "fieldName": "campaign.communicationType",
          "fieldValue": formdata.communicationType
        },
        {
          "fieldName": "startDate",
          "fieldValue": null != formdata.startDate && formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "endDate",
          "fieldValue": null != formdata.endDate && formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "campaign.activityId",
          "fieldValue": null != formdata.activityId ? formdata.activityId : ''
        },
        {
          "fieldName": "campaign.status",
          "fieldValue": formdata.status
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberMgmt/v1/communication/search', data).subscribe(res => {
      this.dataSource8 = new MatTableDataSource(res["items"]);
      this.dataSource8.sort = this.sort8;
      this.communicationResultsLength = res["totalCount"]
      if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.communicationResultsLength) {
        this.paginationData.pageIndex = 0;
        this.paginator8.pageIndex = 0;
        this.searchCommunications();
      }
    }, err => {
      console.log(err)
    })
  }

  sortCommunicationData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortCommunicationColumn = "modifiedTime";
      this.sortCommunicationDirection = "desc";
    } else {
      this.sortCommunicationColumn = sort.active;
      this.sortCommunicationDirection = sort.direction;
    }
    this.searchCommunications();
  }

  resetCommunicationForm() {
    this.buildCommunicationForm();
    this.searchCommunications();
  }

  getCommunicationUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchCommunications();
  }
  CampaignView(ID) {
    console.log(ID);
    localStorage.setItem('CampaignViewID', ID);
    this.router.navigate(['/view-campaign'])
  }
  viewTransactionPage(ID) {
    localStorage.setItem('TxnOid', ID);
    this.router.navigate(['/view-transaction'])
  }
  viewPointsTransactionPage(ID) {
    console.log(ID);
    localStorage.setItem('TxnOid', ID);
    localStorage.setItem('TabName', 'POINTS');
    this.router.navigate(['/view-transaction'])
  }
  viewEnquiry(ID, viewMemId) {
    localStorage.setItem('EnquiryRefID', ID);
    localStorage.setItem('viewMemberID', viewMemId)
    this.router.navigate(['/view-enquiries']);
  }

   moveToView(ID){
     localStorage.setItem('ViewID',ID);
    this.router.navigate(['/view-programs'])
  }

  setValidator() {
    this.programFilterCtrl.setValidators([Validators.required]);
    this.programFilterCtrl.updateValueAndValidity();

    let startDate = this.txnRewardHistoryFormGroup.get('startDate');
    startDate.setValidators([Validators.required]);
    startDate.updateValueAndValidity();

    let endDate = this.txnRewardHistoryFormGroup.get('endDate');
    endDate.setValidators([Validators.required]);
    endDate.updateValueAndValidity();
    
    if (this.txnRewardHistoryFormGroup.valid){
      this.searchRewardHistory();
      return;
    }
    else{
      this.searchRewardTransactionHistory();
    }
  }

  moveToViewCoupons(ID) {
    localStorage.setItem('CouponViewID', ID);
    localStorage.setItem('memberCustomerId', this.memberId.toString());
    this.router.navigate(['/view-coupons'])
  }
}
