import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog, MatSnackBar } from '@angular/material';
import { addAttributesDialog } from '../../../../../shared/components/attributes-dialog/attributes.component';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
import { ExtraValidators } from 'src/app/services/validator-service';
import { Globals } from 'src/app/services/global';
import { addCouponDialog } from '../../../../../shared/components/coupon-dialog/add-coupon.component';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectCategoryDailogComponent } from 'src/app/shared/components/select-category-dailog/select-category-dailog.component';
import { SelectProductDailogComponent } from 'src/app/shared/components/select-product-dailog/select-product-dailog.component';
import { MatDialogConfig } from '@angular/material';

export interface Store {
  storeOid: number;
  storeName: string;
}
export interface Brand {
  brandId: number;
  brandName: string;
}

export interface Mall {
  mallId: number;
  mallName: string;
}


export interface UserData {
  couponId: number;
  couponTitle: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  delete: string;
}


@Component({
  selector: "edit-notifications",
  templateUrl: "./edit-notifications.component.html",
  styleUrls: ["./edit-notifications.component.scss"],
  providers: [
    {
      provide: MAT_STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class EditNotificationsComponent implements OnInit {


  public transactedStores: boolean = false;
  public transactedBrands: boolean = false;
  public storeOid = [];
  public brandId: any

  public storeAllList;
  Stores: Store[] = [];
  storeCtrl = new FormControl();
  filteredStores: Observable<Store[]>;

  public brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredBrands: Observable<Brand[]>;

  public mallList;
  Malls: Mall[] = [];
  mallCtrl = new FormControl();
  filteredMalls: Observable<Mall[]>;

  public storeListALL: any = [];
  public storeListALLValue;

  public selectedStoreOptions;

  // public mallList = [{
  //     mallId: 1,
  //     mallName: 'Banglore Mall'
  // },
  // {
  //     mallId: 2,
  //     mallName: 'Mantri Mall'
  // }];


  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };

  public linkToId;

  tinymce: any;
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Notifications',
    link: 'edit-notifications'
  }
  ];
  storeInclude: boolean = false;
  storeExclude: boolean = false;
  public prePopulateImg = [];
  public prePopulateMallId;
  displayedColumns: string[] = ['couponId', 'couponTitle', 'discountType', 'discountValue', 'startDate', 'endDate', 'delete'];
  dataSource: MatTableDataSource<UserData>;
  public includeExclude;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
  @ViewChildren('content', {read: ElementRef}) inputContent : QueryList<ElementRef>;
  activityValue;
  public selectStoreVal = false;
  public selectedCouponData = false;
  public selectedCoupon: any = [];
  public selectedCouponCount;
  public selectedStore = [];
  public totalCount: [];
  public programBrand;
  public brandOid: number = 0;
  public selectedStoreCount = 0;
  public storeRequired: boolean = false;
  public dataStore: boolean = false;
  public storeErrorMsg: string = "Please select Store";
  public selection = new SelectionModel(true, []);
  public prepopulateStoreId;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public statusValue: string = 'ONLINE';
  checked = true;
  disabled = false;
  panelOpenState = false;
  public activities: any = [];
  public languages = JSON.parse(localStorage.getItem("languageList"));
  public actionType: string;
  public notificationId;
  public pushData: any = [];
  public smsData: any = [];
  public emailData: any = [];
  public toggleVal: boolean = true;
  public optionsChecked: any = [];
  public notificationData: any = [];
  public emailChecked: boolean = false;
  public pushChecked: boolean = false;
  public smsChecked: boolean = false;
  public pushTemplateChecked: boolean = false;
  public smsTemplateChecked: boolean = false;
  public emailTemplateChecked: boolean = false;
  public notificationName: string;
  public notificationStartDate: string;
  public notificationEndDate: string;
  public activity: any;
  public communications: string;
  public dateError1: boolean = false;
  public dateError2: boolean = false;
  public commError: boolean = false;
  public errorValue: boolean = false;
  public languageDirection = [];
  public val;
  public langdir = [];
  public langfield = [];
  public langfieldname = [];
  public minDate: Date = new Date();
  public pushAttr = [];
  public smsAttr = [];
  public emailAttr = [];
  public contentError: boolean = false
  public noOfActionValue: number;
  public storeOidValue;
  public senderList = [];
  public smsSenderList = [];
  public emailSenderList = [];
  public activitySelectedValue;
  public noofTransactionSelect: boolean = false;
  public noofPlaysSelect: boolean = false;
  public attachCoupon: boolean = false;
  public coursesSelect: boolean = false;
  public selectedCouponVal: [];
  public includeExcludeValue;
  public couponOids: [];
  public couponData: any = [];
  public pushHyperLinkReq: boolean = false;
  public prePopulateBrandId;
  getEventEditor;
  getCursorPosition;
  contentSet;
  getRange;
  newNodeAdd;
  setUpTinyMce;
  setDataContent;
  public mallIdValue;
  public imagePath: any = [];
  public uploadError = [];
  public uploadFlag = [];
  public storeImgFlag = [];
  public imgUploadList = false;
  public imagePathTwo = [];
  public imageUploading: boolean = false;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadImgEl') uploadImgEl: ElementRef;

  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imgUpload = false;
  public specificBrands = [];
  public linkToIteamName = '';
  public linkToItemErr : boolean = false;

  pushList = [
    { value: 'Customer Profile', label: 'Customer Profile' },
        { value: 'My Transactions', label: 'My Transactions' },
        { value: 'Points Summary', label: 'Points Summary' },
        { value: 'Our Brands', label: 'Our Brands' },
        { value: 'Coupon', label: 'Coupons' },
        { value: 'Refer and Earn', label: 'Refer and Earn' },
        { value: 'Press Releases', label: 'Press Releases' },
        { value: 'FAQ', label: 'FAQ' },
        { value: 'Customer Tier', label: 'Customer Tier' },
        { value: 'Others', label: 'Others - Lands to Home screen' },
        { value: 'External Link', label: 'External Link' },
        { value: 'All Orders', label: 'All Orders' },
        { value: 'Menu', label: 'Menu' },
        { value: 'Stores', label: 'Stores' },
        { value: 'About Us', label: 'About Us' },
        { value: 'Schedule Order Page', label: 'Schedule Order Page' },
        { value: 'Rewards Dashboard', label: 'Rewards Dashboard' },
        { value: 'Scratch Card Listing Page', label: 'Scratch Card Listing Page' },
        { value: 'Hotsellers Category', label: 'Hotsellers Category' },
        { value: 'Exclusive', label: 'Exclusive' },
        { value: 'ime Bounded', label: 'ime Bounded' },
        { value: 'Healthy', label: 'Healthy' },
        { value: 'Product', label: 'Product' },
        { value: 'Category', label: 'Category' },
];

  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar, private uploadFile: UploadFile) {

    //  this.activatedRoute.params.subscribe((params) => {
    //  this.notificationId = params.id;
    //  });
    this.buildNotificationForm();
    this.buildContentForm();
  }

  ngOnInit() {
    // this.getActivityList();
    // this.getNotificationDataById();
    // this.getAllSenderList();
    // this.getTemplateList();
    // this.prepopulateCampaignVal();
    // this.setTiny();
    let data = localStorage.getItem('NotificationEditID');
    if (data) {
      this.notificationId = data;
      this.getActivityList();

      this.getTemplateList();
      this.getNotificationDataById();
      localStorage.removeItem('NotificationEditID')
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-notifications']);
    }
    this.getAllSenderList();
    this.getMallList();
    this.getAllStoresA();
    this.getAllRegionBrandsA();

    // this.getAllRegionBrands();
  }

  ngAfterViewInit(): void {
    console.log(this.input);
    document.onclick = (args: any): void => {
        let emojiBox = false;
        emojiBox = args.target.parentElement.classList.contains('emoji-mart-emoji')
        if (args.target.id == 'emojiBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
            return;
        } else {
            for (let i = 0; i < this.showEmojiPicker.length; i++) {
                this.showEmojiPicker[i] = false;
            }
            emojiBox = false;
        }

        if ( args.target.id == 'emojiContentBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
            return;
        } else {
            for (let i = 0; i < this.showEmojiPickerAppCOntent.length; i++) {
                this.showEmojiPickerAppCOntent[i] = false;
            }
            emojiBox = false;
        }
    }
}

  public communicationTypes = [
    {
      viewValue: 'App-Push Notification',
      name: 'PUSH',
      checked: false
    },
    {
      viewValue: 'Email',
      name: 'EMAIL',
      checked: false
    },
    {
      viewValue: 'SMS',
      name: 'SMS',
      checked: false
    }
  ]

  updateCheckedOptions(name) {

    this.communicationTypes.forEach(com => {
      if (com.name == name) {
        com.checked = this.firstFormGroup.get('communication').value;
      }
    });

    this.optionsChecked = this.communicationTypes.filter(item => item.checked === true).map(item => item.name);

    this.emailChecked = this.optionsChecked.includes('EMAIL') ? true : false;
    this.pushChecked = this.optionsChecked.includes('PUSH') ? true : false;
    this.smsChecked = this.optionsChecked.includes('SMS') ? true : false;

    this.communications = this.optionsChecked.join(",");
    this.commError = this.communications.length > 0 ? false : true;

  }

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
    this.alertDialog();
  }

  public updateValidationHyperLink(value: any) {
    if (value == 'External Link') {
      let linkTo = this.secondFormGroup.get('pushHyperLink');
      linkTo.setValidators([Validators.required]);
      linkTo.updateValueAndValidity();
      this.pushHyperLinkReq = true;
    } else {
      let linkto = this.secondFormGroup.get('pushHyperLink');
      linkto.clearValidators();
      linkto.updateValueAndValidity();
      this.pushHyperLinkReq = false;
    }
    if(value == 'Product' || value == 'Category'){
      this.linkToId = ''
      this.linkToIteamName = ''
    }
}

  alertDialog(): void {
    const dialogReference = this.dialog.open(notificationDialog, {
      width: '350px',
    });
    dialogReference.componentInstance.statusValue = this.statusValue;
    dialogReference.afterClosed().subscribe(result => {
      if (result) {
        this.toggleVal = !this.toggleVal;
      }
    });
  }

  goBackToFirst(stepper: MatStepper) {
    if (this.activityValue == 'XX No of Transactions' || this.activityValue == 'XX No of Plays' || this.activityValue == 'Registration') {
      if (null != this.dataSource) {
        this.commError = false;
        this.errorValue = false;
      } else {
        this.errorValue = true;
      }
    }
    if (this.errorValue === true ||
      this.commError ||
      this.dateError1 ||
      this.firstFormGroup.valid === false
    ) {
      stepper.previous();
    } else {
      stepper.next();
    }
  }


  // setTiny(){
  // this.tinymce.init({
  // selector: "editor", // change this value according to your HTML
  // plugins: "directionality",
  // directionality: "rtl"
  // });
  // }
  getActivityList() {
    let GET_ACTIVITY_LIST =
      environment.APIEndpoint + "api/rpa/notification/v1/activity/list";

    this.https.getJson(GET_ACTIVITY_LIST).subscribe(
      response => {
        this.activities = response;
      }, err => {
      });
  }

  getNotificationDataById() {
    let data = {
      notificationId: this.notificationId
    };

    this.https.postJson(environment.APIEndpoint + "api/rpa/notification/v1/view", data)
      .subscribe(res => {
          this.notificationData = res;

          this.activityValue = this.notificationData.notificationDetails['activityName'];
          this.toggleVal =
            this.notificationData.notificationDetails.status == "ONLINE"
              ? true
              : false;
          this.statusValue =
            this.notificationData.notificationDetails.status == "ONLINE"
              ? "ONLINE"
              : "OFFLINE";

          //  this.storeOid = editData.categories.map(function (item) {
          //     return item.storeId;
          //   })



          this.populateData();
          this.prepopulateCampaignVal();
        },
        err => {
        });
  }

  prepopulateCampaignVal() {
    if (this.activityValue === "Registration" || this.activityValue === "XX No of Transactions" || this.activityValue === "XX No of Plays") {
      this.attachCoupon = true;
    } else {
      this.attachCoupon = false;
    }
    if (this.activityValue === "XX No of Transactions") {
      this.noofTransactionSelect = true;
    } else {
      this.noofTransactionSelect = false;
    }
    if (this.activityValue === "XX No of Plays") {
      this.coursesSelect = true;
    } else {
      this.coursesSelect = false;
    }
    if (this.activityValue == 'Notification for Transacting at Store') {
      this.transactedStores = true;
    }
    else {
      this.transactedStores = false;
    }
    if (this.activityValue == 'Affiliate Transaction Notification to Customer') {
      this.transactedBrands = true;
    }
    else {
      this.transactedBrands = false;
    }
  }
  public buildNotificationForm() {
    this.firstFormGroup = this.formBuilder.group({
      activity: [""],
      notificationName: ["", Validators.compose([Validators.required])],
      notificationDesc: ["", Validators.compose([Validators.required])],
      communication: [""],
      noofTransactions: [''],
      noofPlays: [''],
      ruleType: [],
      storeId: [''],
      mallCtrl: ['']
      // endDate: ["", Validators.compose([Validators.required])],
      // startDate: ["", Validators.compose([Validators.required])]
    });
  }

  public buildContentForm() {

    this.secondFormGroup = this.formBuilder.group({
      pushTemplate: [''],
      smsTemplate: [''],
      emailTemplate: [''],
      // pushTemplate: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
      // smsTemplate: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
      // emailTemplate: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
      //pushSenderId:['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required), Validators.pattern('[a-zA-Z0-9]*')])],
      emailSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required), Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
      smsSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
      pushLinkTo: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
      specificBrand: ['', Validators.compose([ExtraValidators.conditional(group => this.secondFormGroup.get('pushLinkTo').value === 'Our Brands',
        Validators.required)])],
      pushHyperLink: [''],
      smsHyperLink: [''],
      emailHyperLink: [''],
      pushLocaleArray: this.formBuilder.array([]),
      smsLocaleArray: this.formBuilder.array([]),
      emailLocaleArray: this.formBuilder.array([]),
    });


    this.buildPushLocale();
    this.buildSMSLocale();
    this.buildEmailLocale();

  }

  public buildPushLocale() {
    const control = <FormArray>this.secondFormGroup.controls['pushLocaleArray'];
    for (let i = 0; i < this.languages.length; i++) {

      let newForm = this.formBuilder.group({
        subject: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
        content: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
        languageId: []
      });
      control.push(newForm);
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.showEmojiPicker.push(false);
      this.textAreaAppContent.push('');
      this.textAreaAppSubject.push('');
    }
    for (let l of this.languages) {
      this.uploadFlag.push(false);
      this.uploadError.push(false);
      // this.imagePath.push('');
    }
  }
  public buildSMSLocale() {
    const control = <FormArray>this.secondFormGroup.controls['smsLocaleArray'];
    for (let i = 0; i < this.languages.length; i++) {

      let newForm = this.formBuilder.group({
        // subject: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
        content: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
        languageId: []
      });
      control.push(newForm);
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
    }
  }

  public buildEmailLocale() {
    const control = <FormArray>this.secondFormGroup.controls['emailLocaleArray'];
    for (let i = 0; i < this.languages.length; i++) {

      let newForm = this.formBuilder.group({
        subject: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
        content: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
        languageId: []
      });
      control.push(newForm);
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
    }
  }

  public populateData() {
    this.notificationName = this.notificationData.notificationDetails.notificationName;
    this.notificationStartDate = moment(
      this.notificationData.notificationDetails.notificationStartDate
    ).format("DD-MM-YYYY");
    this.notificationEndDate = moment(
      this.notificationData.notificationDetails.notificationEndDate
    ).format("DD-MM-YYYY");
    this.activity = this.notificationData.notificationDetails.activityName;

    if (this.activityValue == 'Notification for Transacting at Store') {
      this.transactedStores = true;
    }
    else {
      this.transactedStores = false;
    }
    if (this.activityValue == 'Affiliate Transaction Notification to Customer') {
      this.transactedBrands = true;
    }
    else {
      this.transactedBrands = false;
    }

    this.optionsChecked = this.notificationData.notificationDetails.communicationType;
    this.communications = this.optionsChecked;
    this.mallIdValue = this.notificationData.notificationDetails.mallId;
    this.prePopulateBrandId = this.notificationData.notificationDetails.brandId;
    this.getAllRegionBrands(this.prePopulateBrandId)
    if (
      this.notificationData.notificationDetails.communicationType.match("EMAIL")
    ) {
      this.setChecked("EMAIL");
      this.emailChecked = true;
    }
    if (
      this.notificationData.notificationDetails.communicationType.match("PUSH")
    ) {
      this.setChecked("PUSH");
      this.pushChecked = true;
    }
    if (
      this.notificationData.notificationDetails.communicationType.match("SMS")
    ) {
      this.setChecked("SMS");
      this.smsChecked = true;
    }
    if (this.notificationData.notificationDetails['coupons'] != null) {
      this.selectedCoupon = this.notificationData.notificationDetails['coupons'].map(d => d.couponId);
    }

    this.dataSource = new MatTableDataSource(this.notificationData.notificationDetails['coupons']);
    this.selectedStore = this.notificationData.notificationDetails['stores'].map(d => d.storeOid);
    if (this.selectedStore.length > 0) {
      this.dataStore = true;
    } else {
      this.dataStore = false;
    }
    this.getMallVal(this.mallIdValue);
    this.val = this.notificationData.notificationDetails.isExcludeStore;

    if (this.notificationData.notificationDetails.isExcludeStore = 'true') {
      this.firstFormGroup.get('ruleType').setValue(true);
    }
    else if (this.notificationData.notificationDetails.isExcludeStore = 'false') {
      this.firstFormGroup.get('ruleType').setValue(false);
    }

    this.prepopulateStoreId = this.notificationData.notificationDetails['stores'];

    let storeTypeOid;

    for (let i = 0; i < this.prepopulateStoreId.length; i++) {
      storeTypeOid = this.prepopulateStoreId[i].storeId;
    }
    this.firstFormGroup.patchValue({
      activity: this.notificationData.notificationDetails.activityId,
      noofTransactions: this.notificationData.notificationDetails.noOfAction,
      notificationName: this.notificationData.notificationDetails.notificationName,
      notificationDesc: this.notificationData.notificationDetails.notificationDescription,
      notificationCoupons: this.notificationData.notificationDetails['coupons'],
      notificationStores: this.notificationData.notificationDetails['stores'],
      notificationCourses: this.notificationData.notificationDetails['courses'],
      isExcludeStore: this.notificationData.notificationDetails.isExcludeStore == true ? this.includeExclude = 'Exclude' : this.includeExclude = 'Include',
      mallCtrl: this.mallIdValue,
      storeId: this.selectedStore
    });
    this.secondFormGroup.patchValue({
      pushTemplate: this.notificationData.notificationDetails.pushContent.templateId === 0 ? "" : this.notificationData.notificationDetails.pushContent.templateId,
      smsTemplate: this.notificationData.notificationDetails.smsContent.templateId === 0 ? "" : this.notificationData.notificationDetails.smsContent.templateId,
      emailTemplate: this.notificationData.notificationDetails.emailContent.templateId === 0 ? "" : this.notificationData.notificationDetails.emailContent.templateId,
      smsSenderId: this.notificationData.notificationDetails.smsContent.senderId,
      emailSenderId: this.notificationData.notificationDetails.emailContent.senderId,
      pushLinkTo: this.notificationData.notificationDetails.pushContent.linkTo,
      specificBrand: this.notificationData.notificationDetails.pushContent.linkToId!=undefined ? this.notificationData.notificationDetails.pushContent.linkToId : null,
      pushHyperLink: this.notificationData.notificationDetails.pushContent.hyperLink,
      smsHyperLink: this.notificationData.notificationDetails.smsContent.hyperLink,
      emailHyperLink: this.notificationData.notificationDetails.emailContent.hyperLink
    });
    this.pushLocale(
      this.notificationData.notificationDetails.pushContent.pushContentLocale
    );
    this.smsLocale(
      this.notificationData.notificationDetails.smsContent.smsContentLocale
    );
    this.emailLocale(
      this.notificationData.notificationDetails.emailContent.emailContentLocale
    );
      this.linkToId = this.notificationData.notificationDetails.pushContent.linkToId;
      this.linkToIteamName = this.notificationData.notificationDetails.pushContent.linkToItemName;
  }


  getCampaignVal(activity) {
    this.activityValue = activity.value;
    if (this.activityValue == 'XX No of Transactions') {
      this.noofTransactionSelect = true;
      this.coursesSelect = false;
    } else {
      this.noofTransactionSelect = false;
      this.coursesSelect = false;
    }
    if (this.activityValue == 'XX No of Plays') {
      this.noofPlaysSelect = true;
      this.coursesSelect = true;
    } else {
      this.noofPlaysSelect = false;
      this.coursesSelect = false;
    }
    if (this.activityValue == 'Registration' || this.activityValue == 'XX No of Transactions' || this.activityValue == 'XX No of Plays') {
      this.attachCoupon = true;
    } else if (this.activityValue == 'XX No of Plays') {
      this.coursesSelect = true;
    }
    if (this.activityValue == 'Notification for Transacting at Store') {
      this.transactedStores = true;
    }
    else {
      this.transactedStores = false;
    }
    if (this.activityValue == 'Affiliate Transaction Notification to Customer') {
      this.transactedBrands = true;
    }
    else {
      this.transactedBrands = false;
    }
  }

  public pushImgValue: any = [];
  public pushLocale(pushLocale) {
    this.pushImgValue = pushLocale;
    if (pushLocale != undefined && pushLocale.length > 0) {
      for (let i = 0; i < pushLocale.length; i++) {
        const item = <FormArray>(
          this.secondFormGroup.controls["pushLocaleArray"]
        );
        this.textAreaAppSubject[i] = pushLocale[i].subject;
        this.textAreaAppContent[i] = pushLocale[i].content;
        item.at(i).patchValue({
          subject: this.textAreaAppSubject[i],
          content: this.textAreaAppContent[i],
          languageId: pushLocale[i].languageName
        });
      }
    }
    if (pushLocale != undefined && pushLocale.length > 0) {
      this.imagePath = [];
      for (let i = 0; i < this.pushImgValue.length; i++) {
        this.imagePath[i] = this.pushImgValue[i].imagePath;
        this.imagePathTwo[i] = this.pushImgValue[i].imagePathTwo;
        if (this.imagePath[i] != '') {
          this.prePopulateImg.push(true);
          this.uploadFlag.push(true);
        }
        else {
          this.prePopulateImg.push(false);
          this.uploadFlag.push(false);
        }
        if(this.imagePathTwo[i] != ''){
          this.storeImgFlag.push(true);
        }
        else{
          this.storeImgFlag.push(false);
        }
      }
    }
  }

  public smsLocale(smsLocale) {
    if (smsLocale != undefined && smsLocale.length > 0) {
      for (let i = 0; i < smsLocale.length; i++) {
        const item = <FormArray>this.secondFormGroup.controls["smsLocaleArray"];
        item.at(i).patchValue({
          subject: smsLocale[i].subject,
          content: smsLocale[i].content,
          languageId: smsLocale[i].languageName
        });
      }
    }
  }

  public emailLocale(emailLocale) {
    if (emailLocale != undefined && emailLocale.length > 0) {
      for (let i = 0; i < emailLocale.length; i++) {
        const item = <FormArray>(
          this.secondFormGroup.controls["emailLocaleArray"]
        );
        item.at(i).patchValue({
          subject: emailLocale[i].subject,
          content: emailLocale[i].content,
          languageId: emailLocale[i].languageName
        });
      }
    }
  }

  public setChecked(type) {
    this.communicationTypes.forEach(com => {
      if (com.name == type) {
        com.checked = true;
      }
    });
  }

  public onPushChange(selectedValue) {
    this.pushTemplateChecked = true;
    this.pushData.forEach(push => {
      if (push.templateId == selectedValue) {
        this.secondFormGroup.patchValue({
          pushHyperLink: push.hyperLink
        });
        this.pushLocale(push.marketingTemplateLocales);
      }
    });
  }

  public onSMSChange(selectedValue) {
    this.smsTemplateChecked = true;
    this.smsData.forEach(sms => {
      if (sms.templateId == selectedValue) {
        this.secondFormGroup.patchValue({
          smsHyperLink: sms.hyperLink
        });
        this.smsLocale(sms.marketingTemplateLocales);
      }
    });
  }

  selectedEmail(email) {
  }

  public onEmailChange(selectedValue) {
    this.emailTemplateChecked = true;
    this.emailData.forEach(email => {

      if (email.templateId == selectedValue) {
        this.secondFormGroup.patchValue({
          emailHyperLink: email.hyperLink
        });
        this.emailLocale(email.marketingTemplateLocales);
      }
    });
  }

  public getNotificationData() {
    this.notificationName = this.firstFormGroup.get("notificationName").value;
    this.activities.forEach(activity => {
      if (activity.id == this.firstFormGroup.get("activity").value) {
        this.activity = activity.value;
      }
    });
  }

  isSelected(value: boolean): boolean {
    if (value) return true;
    else return false;
  }

  getTemplateList() {
    let GET_TEMPLATE_LIST = environment.APIEndpoint + "api/rpa/marketing/template/v1/list";
    let request1 = {
      templateType: 'PUSH'
    }
    let request2 = {
      templateType: 'SMS'
    }
    let request3 = {
      templateType: 'EMAIL'
    }

    this.https.postJson(GET_TEMPLATE_LIST, request1)
      .subscribe((response) => {
        this.pushData = response;
      }
        , err => {
        })
    this.https.postJson(GET_TEMPLATE_LIST, request2)
      .subscribe((response) => {
        this.smsData = response;
      }
        , err => {
        });
    this.https.postJson(GET_TEMPLATE_LIST, request3)
      .subscribe((response) => {
        this.emailData = response;
      }
        , err => {
        });
  }

  attributeDialog(index, type) {
    const dialogRef = this.dialog.open(addAttributesDialog);
    dialogRef.componentInstance.campaignActivitySelection = this.notificationName;
    dialogRef.componentInstance.couponDataValue = this.couponData;

    dialogRef.afterClosed().subscribe(result => {
      let content = result.map(e => {
        return `${e.fieldName}`
      });

      if (type == "PUSH") {
        this.pushAttr = result.map(e => {
          return e.id;
        });
        const item = <FormArray>(this.secondFormGroup.controls["pushLocaleArray"]);
        this.insertAtCaret(content.join(" "), `#textareaPush${index}`, item, index, content);
      }

      else if (type == "SMS") {
        this.smsAttr = result.map(e => {
          return e.id;
        });
        const item = <FormArray>this.secondFormGroup.controls["smsLocaleArray"];
        this.insertAtCaret(content.join(" "), `#textarea${index}`, item, index, content);
      }

      else if (type == "EMAIL") {
        this.emailAttr = result.map(e => {
          return e.id;
        });
        const item = <FormArray>(this.secondFormGroup.controls["emailLocaleArray"]);
        try {
          let obj_doc = new DOMParser().parseFromString(item.value[index].content, 'text/html');
          let full_string = "";
          for (let i1 = 0; i1 < obj_doc.body.children.length; i1++) {
            full_string = full_string + (obj_doc.body.children[i1].innerHTML).toString();
          }
          // Start code added by rohit gupta
          if (this.setDataContent != 'undefined') {
            this.contentSet = true;
            this.setDataContent = content.join(" ");
            this.addKeyWordsContent();
          }
          // End code added by rohit gupta
        }
        catch (err) {
        }
      }
    });
  }

  public onClick(event) {
    if (this.secondFormGroup.valid) {
      this.contentError = false;
    }
  }

  updateNotification() {
    if(this.secondFormGroup.get('pushLinkTo').value =='External Link'){
      this.updateValidationHyperLink(this.secondFormGroup.get('pushLinkTo').value);
      this.pushHyperLinkReq = true;
      }
      else{
        this.pushHyperLinkReq = false;
      }
    if (this.secondFormGroup.invalid) {
      this.contentError = true;
    }

    if (this.activityValue == 'XX No of Transactions') {
      this.actionType = 'TRANSACTION';
    }
    else if (this.activityValue == 'XX No of Plays') {
      this.actionType = 'PLAY';
    } else {
      this.actionType = null;
    }
    console.log(this.firstFormGroup);
    console.log(this.secondFormGroup);
    if(this.secondFormGroup.get('pushLinkTo').value == 'Product' || this.secondFormGroup.get('pushLinkTo').value == 'Category')
    this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && !this.linkToItemErr) {
      this.noOfActionValue = this.firstFormGroup.get('noofTransactions').value
      for (let i = 0; i < this.selectedStore.length; i++) {
        this.storeOidValue = this.selectedStore[i].storeOid;
      }
      let storeOids: any = this.selectedStore.map(d => d);
      let request = {
        notificationId: this.notificationId,
        activityId: this.notificationData.notificationDetails.activityId,
        notificationName: this.firstFormGroup.get('notificationName').value,
        notificationDescription: this.firstFormGroup.get('notificationDesc').value,
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        communicationType: this.communications,
        isExcludeStore: this.includeExcludeValue ? this.includeExcludeValue : null,
        brandId: this.prePopulateBrandId ? this.prePopulateBrandId : '',
        mallId: this.mallIdValue ? this.mallIdValue : '',
        storeIds: this.firstFormGroup.get('storeId').value,
        noOfAction: this.noOfActionValue ? this.noOfActionValue : null,
        actionType: this.actionType,
        notificationCoupons: {
          couponOids: this.selectedCoupon ? this.selectedCoupon : null
        },
        notificationStores: {
          storeOids: storeOids ? storeOids : null
        },
        notificationCourses: {
          courseOids: null
        }
      }

      if (this.secondFormGroup.get('emailHyperLink').value == undefined) {
        this.secondFormGroup.get('emailHyperLink').setValue('');
      }

      if (this.pushChecked) {
        for (let i = 0; i < this.languages.length; i++) {
          this.secondFormGroup.value.pushLocaleArray[i].languageId = this.languages[i].languageId
        }
        if (this.secondFormGroup.get('pushLinkTo').value === 'Our Brands')
          this.linkToId = this.secondFormGroup.get('specificBrand').value;
        
        let pushContent = {
          templateId: this.secondFormGroup.get('pushTemplate').value,
          linkTo: this.secondFormGroup.get('pushLinkTo').value,
          linkToId: this.linkToId != undefined ? this.linkToId : '',
          linkToItemName : this.linkToIteamName,
          hyperLink: this.secondFormGroup.get('pushHyperLink').value,
          pushContentLocale: this.secondFormGroup.value.pushLocaleArray,
          pushPersonaliseAttr: this.pushAttr
        }
        for (let i = 0; i < this.secondFormGroup.value.pushLocaleArray.length; i++) {
          this.secondFormGroup.value.pushLocaleArray[i].imagePath = this.imagePath[i];
          if (this.imagePath[i] != '') {
            this.prePopulateImg.push(true);
            this.uploadFlag.push(true);
          }
          else {
            this.prePopulateImg.push(false);
            this.uploadFlag.push(false);
          }
        }
        for (let i = 0; i < this.secondFormGroup.value.pushLocaleArray.length; i++) {
          this.secondFormGroup.value.pushLocaleArray[i].imagePathTwo = this.imagePathTwo[i]
      }
        request['pushContent'] = pushContent
      }

      if (this.smsChecked) {
        for (let i = 0; i < this.languages.length; i++) {
          this.secondFormGroup.value.smsLocaleArray[i].languageId = this.languages[i].languageId
        }
        let smsContent = {
          templateId: this.secondFormGroup.get('smsTemplate').value,
          senderId: this.secondFormGroup.get('smsSenderId').value,
          hyperLink: this.secondFormGroup.get('smsHyperLink').value,
          smsContentLocale: this.secondFormGroup.value.smsLocaleArray,
          smsPersonaliseAttr: this.smsAttr
        }
        request['smsContent'] = smsContent
      }
      if (this.emailChecked) {
        for (let i = 0; i < this.languages.length; i++) {
          this.secondFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId
        }

        this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
        let emailContent = {
          templateId: this.secondFormGroup.get('emailTemplate').value == undefined ? '' : this.secondFormGroup.get('emailTemplate').value,
          senderId: this.secondFormGroup.get('emailSenderId').value,
          hyperLink: this.secondFormGroup.get('emailHyperLink').value == undefined ? '' : this.secondFormGroup.get('emailHyperLink').value,
          emailContentLocale: this.secondFormGroup.value.emailLocaleArray,
          emailPersonaliseAttr: this.emailAttr
        }
        request['emailContent'] = emailContent
      }

      let UPDATE_NOTIFICATION = environment.APIEndpoint + "api/rpa/notification/v1/update";
      this.https.postJson(UPDATE_NOTIFICATION, request)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Notification has been updated successfully"
            }
          });
          this.loading = false;
          sessionStorage.clear();
          this.router.navigate(['/search-notifications']);
        }
          , err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          });
    }
  }

  public toggleIncludeExclude(event) {
    if (event.checked == false) {
      this.includeExcludeValue = 0;
      this.includeExclude = 'Include';
      this.firstFormGroup.get('ruleType').setValue(false);
    } else {
      this.includeExcludeValue = 1;
      this.includeExclude = 'Exclude';
      this.firstFormGroup.get('ruleType').setValue(true);
    }
  }

  addCoupon() {
    const dialogRef = this.dialog.open(addCouponDialog);
    dialogRef.componentInstance.addnotificationCoupon = this.activityValue;
    dialogRef.componentInstance.couponList = this.selectedCoupon;
    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.selectedCoupon = [];
        this.selectedCouponCount = result.tableData.length;
        for (let i = 0; i < result["tableData"].length; i++) {
          this.selectedCouponVal = result["tableData"][i].couponId;
        }
        this.dataSource = new MatTableDataSource(result['']);
        this.dataSource = new MatTableDataSource(result["tableData"]);

        if (this.selectedCouponCount != 0) {
          this.selectedCouponData = true;
          for (let i = 0; i < result.tableData.length; i++) {
            let couponId = result.tableData[i].couponId;
            this.selectedCoupon.push(couponId);
            const arrrayTemp = this.selectedCoupon;
            this.selectedCoupon = Array.from(new Set(arrrayTemp));
          }
        } else {
          this.selectedCouponData = false;
        }
      } else {
        if (this.notificationData.notificationDetails['coupons'].length > 0) {
          this.selectedCoupon = this.selectedCoupon;
        }
      }
    });
  }

  removeCoupon(couponId) {
    const index = this.dataSource.data.findIndex(d => d.couponId == couponId);
    this.dataSource.data.splice(index, 1);
    this.selectedCoupon.splice(index, 1);
    this.table.renderRows();
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openStoresDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    dialogRef.componentInstance.programBrand = this.programBrand;
    dialogRef.componentInstance.brandOid = this.brandOid;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.selectedStore = [];
          this.selectedStoreCount = result.tableData.length;
          if (this.selectedStoreCount != 0) {
            this.storeRequired = false;
            for (let i = 0; i < result.tableData.length; i++) {
              let storeId = result.tableData[i].storeOid;
              this.selectedStore.push(storeId);
              const arrrayTemp = this.selectedStore;
              this.selectedStore = Array.from(new Set(arrrayTemp));
              if (this.selectedStore.length) {
                this.selectStoreVal = true;
                this.dataStore = false;
                setTimeout(() => {
                  this.selectStoreVal = false;
                  if (this.selectStoreVal == false) {
                    this.dataStore = true;
                  }
                }, 2000);
              }
            }
          } else {
            this.storeErrorMsg = "Please select Store";
          }
        }
      });
  }

  public getAllSenderList() {
    let GET_ALL_SENDER_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/get/senderList";
    this.http.getJson(GET_ALL_SENDER_LIST)
      .subscribe((response) => {
        this.senderList = response;
        for (let sender of this.senderList) {
          if (sender.templateType == 'SMS') {
            this.smsSenderList.push(sender.senderId);
          } else if (sender.templateType == 'EMAIL') {
            this.emailSenderList.push(sender.senderId);
          }
        }
      });
  }

  expandDataEmail() {
    var allifram = document.getElementById("arabicID");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;text-align: right;");
  }
  public uploadImage(event: FileList, i) {
    // this.imageUploading = true;
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
      if (event[0].size < 1000000) {
        // this.imageErr[i] = false;
        // this.imageErrMsg[i] = "";
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadFlag[i] = true;
            // this.imageUploading = false;
            this.prePopulateImg[i] = true;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
          });
      } 
    } 
  }

  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    this.prePopulateImg[index] = false;
    const control = this.secondFormGroup.get('notificationArray') as FormArray;
  }

  public removeDetailImage(index) {
    this.imagePathTwo[index] = "";
    this.storeImgFlag[index] = false;
    const control = this.secondFormGroup.get('notificationArray') as FormArray;
  }


public uploadFullImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].size < 5000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'store360', 'images')
          .subscribe((response) => {
            this.imagePathTwo[i] = response['message'];
            this.storeImgFlag[i] = true;
            this.uploadImgEl.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Internal server error"
              }
            });
          });
      }
      else {
        this.imagePathTwo[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePathTwo[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 5Mb"
        }
      });
    }
  }

  getMallList() {
    let cityId = '';
    let GET_ALLMALLS = environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls?cityIds=" + cityId;
    this.http.getJson(GET_ALLMALLS)
      .subscribe((response) => {
        this.mallList = response;

      },
        (err) => {
        });
  }

  getMallVal(value) {
    this.mallIdValue = value;
    this.storeListALLValue = [];
    let GET_STORE_BY_MALLID = environment.APIEndpoint + 'api/rpa/store/v1/get/mallStores?mallId=' + this.mallIdValue;
    this.https.getJson(GET_STORE_BY_MALLID).subscribe
      ((res) => {
        this.storeListALLValue = res['storeList'];
        res.forEach(res => {
          this.storeListALL.push({
            "languageDirection": res.languageDirection,
            "storeId": res.storeId,
            "storeName": res.storeName,
            "storeSpecId": res.storeSpecId,
            "value": res.storeId
          })
        })
      });
    this.storeListALL = this.storeListALLValue;

    var uniqueArray = this.removeDuplicatesJSON(this.storeListALL, 'storeId');
    this.storeListALL = uniqueArray;
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
      this.storeAllList = response["items"];
      for (let i = 0; i <= this.storeAllList.length - 1; i++) {
        let objbrandkey = {
          storeOid: this.storeAllList[i]['storeOid'],
          storeName: this.storeAllList[i]['storeName'],
        }
        this.Stores.push(objbrandkey);
      }
      this.filteredStores = this.storeCtrl.valueChanges
        .pipe(
          startWith(''),
          map(store => store ? this._filterStores(store) : this.Stores.slice())
        );
    },
      (error) => {
      });
  }

  private _filterStores(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.Stores.filter(store => store.storeName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllStore(storeId) {
    this.storeOid = storeId;
  }

  getAllRegionBrands(prePopulateBrandId) {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.http.getJson(GET_ALL_CITIES)
      .subscribe((response) => {
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objbrandkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          this.Brands.push(objbrandkey);
        }
        this.filteredBrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
        for (let j = 0; j < this.Brands.length; j++) {
          if (this.Brands[j].brandId == this.prePopulateBrandId) {
            this.brandCtrl.setValue(this.Brands[j].brandName);
          }
        }
      },
        (error) => {
        });
  }

  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllBrand(brandId) {
    this.prePopulateBrandId = brandId;
  }

  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }



  onChangeInEditor(event) {

    this.getEventEditor = event.editor;
  }
  addKeyWordsContent() {
    if (this.contentSet) {
      this.getRange = this.getEventEditor.selection.getRng();
      this.newNodeAdd = this.getEventEditor.getDoc().createElement("span");
      this.newNodeAdd.innerText = `${this.setDataContent}`;
      this.getRange.insertNode(this.newNodeAdd);
      this.contentSet = false;
    }
  }

  insertAtCaret(text, id, formgroup, index, content) {
    const textarea = (<HTMLTextAreaElement>document.querySelector(id));

    textarea.setRangeText(
      text,
      textarea.selectionStart,
      textarea.selectionEnd,
      'end'
    )
    const item = formgroup;
    item.at(index).patchValue({
      content: textarea.value,
    });
  }

  getAllRegionBrandsA() {
    let GET_ALL_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.http.getJson(GET_ALL_BRANDS)
      .subscribe((response) => {
        this.specificBrands = response;
      }),
      (error) => {
      }
  }

  openLinkToItemPopUP(){
    const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "unset";
      dialogConfig.height = 'auto';
      dialogConfig.autoFocus = false;
      dialogConfig.panelClass = 'view-product-dialogue';
      let selectedItemList = {
        itemId : this.linkToId
      }
      let dialogRef;
      if(this.secondFormGroup.get('pushLinkTo').value == 'Product'){
        dialogRef = this.dialog.open(SelectProductDailogComponent ,dialogConfig);
      }
      else if(this.secondFormGroup.get('pushLinkTo').value == 'Category'){
        dialogRef = this.dialog.open(SelectCategoryDailogComponent ,dialogConfig);
      }
      dialogRef.componentInstance.TempItemList = selectedItemList;
      dialogRef.afterClosed().subscribe(result => {
          this.linkToId = result.itemId
          this.linkToIteamName = result.linkToIteamName
          this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
      });
  }

   // For the emoji implementation
  message = [];
  public textAreaAppSubject: any[] = [];
  public textAreaAppContent: any[] = [];
  public textAreaSMSContent: string = '';
  public textAreaEmailSub: string = '';
  public textAreaEmailContent: string = '';

  showEmojiPicker = [];
  showEmojiPickerAppCOntent = [];
  showEmojiPickerSMSCOntent = [];
  showEmojiPickerEmailSub = [];
  showEmojiPickerEmailContent = [];

  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'twitter';
  // App Push Section
  toggleEmojiPicker(index) {
      this.showEmojiPicker[index] = !this.showEmojiPicker[index];
  }
  addEmojiAppSubject(event,index) {
    const emoji : string = (event.emoji as any).native;
    const input = (index == 0) ? this.input.first.nativeElement : this.input.last.nativeElement;
    input.focus();

    const text = this.textAreaAppSubject[index] + `${event.emoji.native}`;
    this.textAreaAppSubject[index] = text;

    if (document.execCommand){ 
      var event1 = new Event('input');
      document.execCommand('insertText', false, emoji);
      return; 
    }
    const [start, end] = [input.selectionStart, input.selectionEnd]; 
    input.setRangeText(emoji, start, end, 'end');
  }

  toggleEmojiPickerAppContent(index) {
      this.showEmojiPickerAppCOntent[index] = !this.showEmojiPickerAppCOntent[index];
  }
  addEmojiAppContent(event,index) {
      // this.textAreaAppContent = `${this.textAreaAppContent}${event.emoji.native}`;
      const emoji : string = (event.emoji as any).native;
      const inputContent = (index == 0) ? this.inputContent.first.nativeElement : this.inputContent.last.nativeElement;
      inputContent.focus();
      const text = this.textAreaAppContent[index] + `${event.emoji.native}`;
      this.textAreaAppContent[index] = text;
      if (document.execCommand){ 
        var event1 = new Event('inputContent');
        document.execCommand('insertText', false, emoji);
        return; 
      }
      const [start, end] = [inputContent.selectionStart, inputContent.selectionEnd]; 
      inputContent.setRangeText(emoji, start, end, 'end');
  }
}