import { OnInit, ViewChild, Output, Input, Component, EventEmitter,ViewEncapsulation, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
//import { ResetPinComponent } from '../reset-pin/reset-pin.component';
import { SelectionModel } from '@angular/cdk/collections';

export interface UserData {
  userName: string;
  fullName: string;
  role: string;
  select: string;
  // phoneNumber: string;
  // emailId: string;
  // createdTime: string;
  // createdUserName: string;
  // status: string;
  // resetPin:string;
}

export interface Role {
  roleId: string;
  roleName: string;
}

@Component({
  selector: 'app-user-location-dialog',
  templateUrl: './user-location-dialog.component.html',
  styleUrls: ['./user-location-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

  export class UserLocationDialogComponent implements OnInit {
 
    tableFormCoupon:FormGroup;

    selectedIndex: number = 0;
    public searchStoreVal: boolean = true;
    public noRecords: boolean = false;
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    displayedColumns: string[] = ['select','userId', 'fullName', 'ROLE_OID'];
    public searchUserForm: FormGroup;
    public paginationData;
    public resultsLength = 0;
    public roleId;
    public status = true;
    public checked: boolean = true;
    dataSource: MatTableDataSource<any>;
    public totalCount: [];
    public storeValList: [];
    public stores: [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public sortColumn = "modifiedTime";
    public sortDirection = "desc";
    public success: boolean = false;
    public resetErrorSend: any;
    // public roleId;
    public roleList;
    Roles: Role[] = [];
    roleCtrl = new FormControl();
    filteredRoles: Observable<Role[]>;
    @Input('isDisabled') isDisabled: boolean = false;
    public loadingResponse: boolean = false;
  
    public selection = new SelectionModel(true, []);
    dataInView = [];
    checkboxClicked = false;

//  @Input('selectedUsers') selectedUsers = [];
// @Input('getCoupons') getCoupons  = [];

selectedUsers = [];
getCoupons = [];
getProduct = [];

    paginationDetail = new BehaviorSubject(
      {
        length: 5,
        pageIndex: 0,
        pageSize: 5
      });
    error: boolean;
    unverifiedEmail: any;
  originalSelection: any;
  CouponJsonData:any;
  myForm: FormGroup;
  popupdata: any;
  selecteduserLength: any;
  result: any[];
  couponsgiftingLimitsArry: any;
  programgiftingLimitsArry: any;
  productgiftingLimitsArry: any;

    constructor(private fb: FormBuilder,private router: Router,public dialog: MatDialog, 
      private https: HttpService,private http: HttpClient,
      private dialogRef: MatDialogRef<MatDialog>,
      public dialogRef2: MatDialogRef<UserLocationDialogComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
      
      ) 
      {

        dialogRef.disableClose = true;
console.log('mydata',mydata);
this.popupdata = mydata;
     
      this.dataSource = new MatTableDataSource();



      // let data2 = {
      //   "page": 0,
      //   "pageSize": 10,
      //   "order": {
      //     "column": "modifiedTime",
      //     "dir": "desc"
      //   },
      //   "keySearch": "",
      //   "fieldSearch": [
      //     {
      //       "fieldName": "fullName",
      //       "fieldValue": ""
      //     },
      //     {
      //       "fieldName": "emailId",
      //       "fieldValue": ""
      //     },
      //     {
      //       "fieldName": "phoneNumber",
      //       "fieldValue": ""
      //     },
      //     {
      //       "fieldName": "status",
      //       "fieldValue": ""
      //     }
      //   ]
      // }

      // this.https.postJson1(environment.APIEndpoint + 'api/rpa/user/search',data2).subscribe(res => {
      //   console.log('res of users',res);
      //   this.totalCount = res["totalCount"];
      //   this.storeValList = res['items'];
      //   console.log(this.storeValList);
      //   console.log(this.storeValList.length);
  
      //   for (let i = 0; i < this.storeValList.length; i++) {
      //     this.stores = this.storeValList[i];
      //   }
  
  
      // });
   //       "fieldName": "role.oid",
      //       "fieldValue": ""
      //     },
      //      {
      //       "fieldName": "StoreName",
      //       "fieldValue": ""
      //     },
      //     {
      //       "fieldName": "status",
      //       "fieldValue": ""
      //     }
      //   ]
      // }

      // this.https.postJson1(environment.APIEndpoint + 'api/rpa/user/search',data2).subscribe(res => {
      //   console.log('res of users',res);
      //   this.totalCount = res["totalCount"];
      //   this.storeValList = res['items'];
      //   console.log(this.storeValList);
      //   console.log(this.storeValList.length);
  
      //   for (let i = 0; i < this.storeValList.length; i++) {
      //     this.stores = this.storeValList[i];
      //   }
  
  
      // });
  
    }///constructor end
  

    valueFromBackend = [
      {
        "couponId": 371,
        "couponTitle": "program dummy",
        "discountType": "TRANSACTION_DISCOUNT_AMOUNT",
        "discountValue": 20,
        "createdBy": "admin",
        "modifiedTime": "2021-07-13 16:35:00",
        "startDate": "2021-07-13",
        "endDate": "2021-07-21",
        "status": "ONLINE",
        "modifiedUserId": 1,
        "modifiedUserName": "admin",
        "couponType": "TYPE2",
        "createdOn": "2021-07-13 16:35:00",
        "codeGenerationType": "GENERIC"
    },
    {
      "couponId": 372,
      "couponTitle": "Transaction Discount Amount 20 in coupon",
      "discountType": "TRANSACTION_DISCOUNT_AMOUNT",
      "discountValue": 20,
      "createdBy": "admin",
      "modifiedTime": "2021-07-13 16:35:00",
      "startDate": "2021-07-13",
      "endDate": "2021-07-21",
      "status": "ONLINE",
      "modifiedUserId": 1,
      "modifiedUserName": "admin",
      "couponType": "TYPE2",
      "createdOn": "2021-07-13 16:35:00",
      "codeGenerationType": "GENERIC"
  }
]


     ngOnInit() {
      //console.log('a>>>>',this.getCoupons);
     /// console.log('b>>>>',this.valueFromBackend);
     //  this.selectedUsers = mydata.selectedUserArray;
      /// this.getCoupons = mydata.CouponArray;
   ///  this.popupdata = 
   let couponCount = this.popupdata.getCoupons.length;
 
   let addProgramcount = this.popupdata.getProgram.length;
 
      let productCount_dynamic = this.popupdata.getProduct.length;

      console.log('product count',productCount_dynamic);

      console.log('product data on popup',productCount_dynamic);

      this.myForm = this.fb.group({
        
        myCouponArray: this.fb.array([...this.createCoupons(couponCount)]),
        myProgramArray: this.fb.array([...this.createProgram(addProgramcount)]),
        myProductArray: this.fb.array([...this.createProduct(productCount_dynamic)])
     
      });



    this.patch();

      // dynamically set value
    /// this.myForm.setValue(this.valueFromBackend);

      this.couponData();
      this.createCouponForm();
      this.paginationData = {
        pageIndex: 0,
        pageSize: 5,
        length: this.resultsLength,
        previousPageIndex: 0
      };
      this.searchUserForm = this.fb.group({
       // fullName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],
        fullName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],

        emailId: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
        phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
        storeName: [""],
      //  userName: [''],
       // createdUserName: [''],
        userid: [""],
        searchVal: [""]
      }); 
      this.getRoles();
      this.dataSource = new MatTableDataSource();
      this.filterData();
      this.searchVal();
  //comm on 12 sep
    //   if(sessionStorage.getItem('CheckType')=='Users') {
           

    //         if (sessionStorage.searchValue) {
    //     this.searchUserForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
    //   }

      
    //   if (sessionStorage.paginationData) {
    //     let obj = JSON.parse(sessionStorage.paginationData);
    //     this.paginationDetail = new BehaviorSubject({
    //       length: obj.length,
    //       pageIndex: obj.pageIndex,
    //       pageSize: obj.pageSize
    //     });
    //     this.paginationDetail.next(obj);
    //     this.paginationData = obj;
    //     this.searchVal();
    //     this.paginator.pageIndex = obj.pageIndex;
    //   } else {
    //     this.searchVal();
    //   }
    // }else{
    //     sessionStorage.clear();
    //     this.searchVal();
    //     sessionStorage.setItem('CheckType','Users');
    //   }
      //comm on 12 sep -end

  
    }///ngOnit end

///

    private createItemCoupon(): FormGroup {
      return this.fb.group({
        couponName: '',
     //   maxGiftPerCustomer: ['', Validators.compose([Validators.required,Validators.max(amount)])],
        maxGiftPerCustomer: ['', Validators.compose([Validators.required])],

        maxGiftPerEvent: ['', Validators.compose([Validators.required])],
        productOID:''
      });
    }

    private createItemProgram(): FormGroup {
      return this.fb.group({
        programName: '',
        maxGiftPerCustomer: ['', Validators.compose([Validators.required])],
        maxGiftPerEvent: ['', Validators.compose([Validators.required])],
        productOID:''
      });
    }
    private createItemProduct(): FormGroup {
      return this.fb.group({
        productName: '',
        maxGiftPerCustomer: ['', Validators.compose([Validators.required])],
        maxGiftPerEvent: ['', Validators.compose([Validators.required])],
        productOID:''
      });
    }
  
    private createCoupons(couponCount: number): FormGroup[] {
      let arr = [];
      for (let i = 0; i < couponCount; i++) {
        arr.push(this.createItemCoupon());
      }
      console.log(arr)
  
      return arr;
    }


    private createProgram(addProgramcount: number): FormGroup[] {
      let arr = [];
      for (let i = 0; i < addProgramcount; i++) {
        arr.push(this.createItemProgram());
      }
      console.log(arr)
  
      return arr;
    }


    private createProduct(productCount_dynamic: number): FormGroup[] {
      let arr = [];
      for (let i = 0; i < productCount_dynamic; i++) {
        arr.push(this.createItemProduct());
      }
      console.log(arr)
  
      return arr;
    }

    fields: any;

    patch() {

      console.log('product name',this.popupdata.getProduct);

    //  const control = <FormArray>this.myForm.get('myCouponArray');
    //   this.valueFromBackend.forEach(x => {
    //     control.push(this.patchValues(x.couponId))
    //   })
      for(let i =0;i<this.popupdata.getCoupons.length;i++){
       /// this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue(this.getCoupons[i]['couponTitle']);
        this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue(this.popupdata.getCoupons[i]['couponTitle']);
        this.myForm['controls']['myCouponArray']['controls'][i]['controls']['productOID'].patchValue(this.popupdata.getCoupons[i]['couponId']);
       // this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerCustomer'].setValidators(Validators.compose([Validators.required,Validators.max(10)]));
       // this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerCustomer'].['', Validators.compose([Validators.required,Validators.max(amount)])];
       // maxGiftPerCustomer: ['', Validators.compose([Validators.required,Validators.max(amount)])],

       // this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerCustomer'].updateValueAndValidity();

   
      }

       for(let i =0;i<this.popupdata.getProgram.length;i++){
        this.myForm['controls']['myProgramArray']['controls'][i]['controls']['programName'].patchValue(this.popupdata.getProgram[i]['programName']);
        this.myForm['controls']['myProgramArray']['controls'][i]['controls']['productOID'].patchValue(this.popupdata.getProgram[i]['programID']);

      }

      for(let i =0;i<this.popupdata.getProduct.length;i++){
        this.myForm['controls']['myProductArray']['controls'][i]['controls']['productName'].patchValue(this.popupdata.getProduct[i]['productName']);
        this.myForm['controls']['myProductArray']['controls'][i]['controls']['productOID'].patchValue(this.popupdata.getProduct[i]['productOid']);

      }
    }
  
    // patchValues(x) {
    //   return this.fb.group({
    //     couponName: [x]
    //   })
    // }

    openFilter() {
      this.status = !this.status;
  
    }
    // isAllSelected() {
    //   const numSelected = this.selection.selected.length;
    //   const numRows = this.dataInView.length;
    //   return numSelected === numRows;
    // }

      /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.checkboxClicked || this.isAllSelected() ?
  //      // this.selection.clear() :
  //      this.dataInView.forEach(row => this.selection.deselect(row)) :
  //      this.dataInView.forEach(row => this.selection.select(row));
  //    this.checkboxClicked = !this.checkboxClicked;
  //  }



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
  
    selectRow(row) {
      console.log(row.target.value);
    }
    onCloseClick(): void {
      let obj = {
        'buttonName': 'CANCEL',
        'tableData': this.originalSelection,
        'totalCount': this.resultsLength
      }
      localStorage.removeItem('stores');
      // localStorage.setItem('stores', JSON.stringify(this.stores));
      this.dialogRef.close(obj);
    }


    ///get role for filter - on click on role mat-autocomplte
    getRoles() {
      let GET_ALL_ROLES = environment.APIEndpoint + "api/rpa/role/v1/get/roles";
      this.https.getJson(GET_ALL_ROLES)
          .subscribe((response) => {
              this.roleList = response;

             // console.log('all roles',this.roleList);

              for (let i = 0; i <= this.roleList.length - 1; i++) {
                  let objMallkey = {
                      roleId: this.roleList[i]['roleId'],
                      roleName: this.roleList[i]['roleName'],
                  }
                 // console.log(objMallkey);
                  this.Roles.push(objMallkey);
              }
              this.filteredRoles = this.roleCtrl.valueChanges
                  .pipe(
                      startWith(''),
                      map(role => role ? this._filterRoles(role) : this.Roles.slice())
                  );
          },
              (error) => {
                  console.log(error);
              });
  }
  private _filterRoles(value: string): Role[] {
      const filterValue = value.toLowerCase();
      return this.Roles.filter(role => role.roleName.toLowerCase().indexOf(filterValue) === 0);
  }
  
    getUpdate(event) {
      sessionStorage.setItem('paginationData', JSON.stringify(event));
      this.paginationDetail.next(event);
      this.paginationData = event;
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
  
    private compare(a, b, isAsc) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  
  
    myTrim(x) {
      return x.replace(/^\s+|\s+$/gm, '');
    }
    searchKey(){
      this.getUpdate(this.paginationData);
      this.paginator.pageIndex = this.paginationData.pageIndex;
    }
  
    getRole(roleId){
      this.roleId = roleId;
    //  console.log(this.roleId);
    }
    searchVal() {
      this.searchStoreVal = true;
      let formdata = this.searchUserForm.value;
      this.loadingResponse = true;
      sessionStorage.setItem('searchValue', formdata.searchVal);
     // console.log(formdata);

      if (this.popupdata.selectedUsers.length > 0) {
         this.selecteduserLength = this.popupdata.selectedUsers.length;
         console.log('selectd uderrrr', this.selecteduserLength)
      }else{
        this.selecteduserLength = 0;
      }

      let data2 = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : 0,
        "pageSize": this.paginationData !== undefined ? this.selecteduserLength+this.paginationData.pageSize : this.selecteduserLength+5,
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": formdata.searchVal ? formdata.searchVal : "",
        "fieldSearch": [
          {
            "fieldName": "FULL_NAME",
            "fieldValue": formdata.fullName ? formdata.fullName : ""
          },
          {
            "fieldName": "EMAIL_ID",
            "fieldValue": formdata.emailId ? formdata.emailId : ""
          },
          {
            "fieldName": "MOBILE_NUMBER",
            "fieldValue": formdata.phoneNumber ? formdata.phoneNumber : ""
          },
          {
            "fieldName": "ROLE_OID",
            "fieldValue": this.roleId ? this.roleId : ""
          },
        
          {
            "fieldName": "STATUS",
            "fieldValue": "ONLINE"
          },
          {
            "fieldName": "storeName",
            "fieldValue":  formdata.storeName ? formdata.storeName : ""
          },
           {
            "fieldName": "brandOid",
            "fieldValue": ""
          }
        ]
      }
//console.log('reqbody',data2);
let url = 'http://14.142.204.96:8080/api/rpa/user/v3/search'
      this.https.postJson(environment.APIEndpoint + 'api/rpa/user/search', data2).subscribe(res => {
      // this.https.postJson(environment.APIEndpoint + 'api/rpa/user/v3/search', data2).subscribe(res => {
        // this.https.postJson(url,data2).subscribe(res => {
        console.log('selected user poup',this.popupdata.selectedUsers);

        if (this.popupdata.selectedUsers.length > 0) {
          let result = res["items"].filter( el => (-1 == this.popupdata.selectedUsers.indexOf(el.userId)));
          console.log(result);
        
        console.log('result>>>>',result);   
          this.searchStoreVal = false;
        this.loadingResponse = false;
      
      
        this.resultsLength = res["totalCount"];
        this.dataSource.data =result;
        }else{
          this.searchStoreVal = false;
          this.loadingResponse = false;
         
        
          this.resultsLength = res["totalCount"];
          this.dataSource.data = res["items"];
        }

////////

       //this.popupdata.selectedUsers.length = 0;
           if (this.popupdata.selectedUsers.length > 0) {
            for (let i of res["items"]) {
              if (this.popupdata.selectedUsers.indexOf(i["userId"]) > -1) {
                this.selection.select(i);

            

              }
            }
            this.originalSelection = this.selection.selected;
          }
        
///////

        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
      }, err => {
        this.searchStoreVal = true;
        this.loadingResponse = false;
        console.log(err);
      })
  
    }
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
  
    }
    indexResetFormdataSearch(){
      
      let formdata = this.searchUserForm.value;
      if (formdata.searchVal!= '' && formdata.searchVal!= null){
        this.paginationData.pageIndex = 0;
      }
      if (formdata.fullName!='' && formdata.fullName!=null){
        this.paginationData.pageIndex = 0;
      }
      if (formdata.emailId!='' && formdata.emailId!=null){
        this.paginationData.pageIndex = 0;
      }
      if (formdata.phoneNumber!='' && formdata.phoneNumber!=null){
        this.paginationData.pageIndex = 0;
      }
      if (this.roleId!='' && this.roleId!=null){
        this.paginationData.pageIndex = 0;
      }
      if (formdata.storeName!='' && formdata.storeName!=null){
        this.paginationData.pageIndex = 0;
      }
      if (formdata.status!='' && formdata.status!=null){
        this.paginationData.pageIndex = 0;
      }
    }
  
    resetForm() {
      this.noRecords = false;
      // this.searchUserForm.reset();
      this.roleCtrl.reset('');
      this.roleId = '';
      this.searchUserForm.reset();
      // this.paginationData = {
      //   pageIndex: 0,
      //   pageSize: 10,
      //   length: this.resultsLength,
      //   previousPageIndex: 0
      // };
      this.loadingResponse = false;
      this.searchVal();
      this.getUpdate(this.paginationData);
      this.paginator.pageIndex = this.paginationData.pageIndex;
  
    }
  
  
    filterData() {
      this.filteredOptions = this.searchUserForm.get('storeName').valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.stores.filter(store => this.storeValList[''].option.toLowerCase().includes(filterValue));
    }
  
 
  

    MoveToView(ID){
    ///  localStorage.setItem('UserViewID',ID);
    //  this.router.navigate(['/view-user']);
    }
    getRoleId(val){
      console.log(val);
      this.roleId = val;
    }

    giftingType(event){

    }
public count = 0;
public users:any;
public selectedUserIdnew = [];

submitform:boolean;
    closeDialog() {

////apply validation start
this.submitform = true;

if(this.popupdata.getCoupons.length>0){
 
  if(this.myForm.controls['myCouponArray'].invalid){
    return;
  }

}

if(this.popupdata.getProgram.length>0){
 
  if(this.myForm.controls['myProgramArray'].invalid){
    return;
  }

}
if(this.popupdata.getProduct.length>0){
 
  if(this.myForm.controls['myProductArray'].invalid){
    return;
  }

}









///////////////end of validation


      let selectedUserId = [];
      let selectedUsers = this.selection.selected;
      console.log('selectedUsers>>>',selectedUsers);


      if (this.popupdata.selectedUsers.length > 0) {
        this.result = selectedUsers.filter( el => (-1 == this.popupdata.selectedUsers.indexOf(el.userId)));
        //console.log(result);
      
      console.log('result of new user>>>>', this.result);   
      
   
     
      }else{
        this.result = this.selection.selected;
      }

      for(let i=0;i< this.result.length;i++){
        selectedUserId.push(this.result[i]['userId']);
        this.selectedUserIdnew.push(this.result[i]['userId']);
        
       }
     
    
      // console.log('selectedUserId>>>',selectedUserId);
      // console.log('selectedUserIdnew>>>',this.selectedUserIdnew);

    

      // let arr = [1,2,3,4,3,2222,2222]
      // let arr1 = arr.filter(function (value, index, array) { 
      //     return array.indexOf(value) === index;
      // });
      
      // console.log(arr1);

      let couponGiftingData = this.myForm.get('myCouponArray').value;
      let programgiftingData = this.myForm.get('myProgramArray').value;
      let productgiftingData = this.myForm.get('myProductArray').value;

console.log('couponGiftingData>>>',couponGiftingData);
console.log('programgiftingData>>>',programgiftingData);
console.log('productgiftingData>>>',productgiftingData);


      if(couponGiftingData.length>0){
        this.couponsgiftingLimitsArry = couponGiftingData;
        this.couponsgiftingLimitsArry.map(res =>{

           res["giftcode"] = +res['productOID'];
           res['productName'] = res['couponName'] ? res['couponName'] : '';
           res['variantName'] = '';
           res['productOID'] =  res['productOID'] ? res['productOID'] : '';
           res['variantOid'] =  '';
           res['language_code'] = '';
           res['maxGiftPerCustomer'] = +res['maxGiftPerCustomer'];
           res['maxGiftPerEvent'] = +res['maxGiftPerEvent'];
            delete res['couponName'];

          })
      }

      if(programgiftingData.length>0){
        this.programgiftingLimitsArry = programgiftingData;
        this.programgiftingLimitsArry.map(res =>{
           res["giftcode"] =  +res['productOID'];
           res['productName'] = res['programName'] ? res['programName'] : '';
            res['variantName'] = '';
           res['productOID'] = res['productOID'] ? res['productOID'] : '';
           res['variantOid'] =  '';
           res['language_code'] = '';
           res['maxGiftPerCustomer'] = +res['maxGiftPerCustomer'];
           res['maxGiftPerEvent'] = +res['maxGiftPerEvent'];
           delete res['programName'];

        })
     }


     if(productgiftingData.length>0){
      this.productgiftingLimitsArry = productgiftingData;

      console.log('product gifting in map loop final',productgiftingData);

      this.productgiftingLimitsArry.map(res =>{
         res["giftcode"] =  +res['productOID'];
         res['productName'] = res['productName'] ? res['productName'] : '';
         res['variantName'] = '';
         res['productOID'] =  res['productOID'] ?  res['productOID'] : '';
         res['variantOid'] =  '';
         res['language_code'] = '';
         res['maxGiftPerCustomer'] = +res['maxGiftPerCustomer'];
         res['maxGiftPerEvent'] = +res['maxGiftPerEvent'];
        // delete res['programName'];

      })
   }

         this.users = {
          'userOid': selectedUserId.join().split(','), 
          'couponsgiftingLimits':this.couponsgiftingLimitsArry ? this.couponsgiftingLimitsArry : [],
          'programgiftingLimits':this.programgiftingLimitsArry ? this.programgiftingLimitsArry : [],
          'productgiftingLimits':this.productgiftingLimitsArry ? this.productgiftingLimitsArry : []
       
          }
          console.log('users gifting details>>>',this.users);

       this.dialogRef2.close({ event: 'close',
       'buttonName': 'SELECT',
       'tableData': this.selection.selected,
       'totalCount':this.resultsLength,
       'jsondata':this.users
      
      });

    }


    onSelect(){
   //  alert('hhhh');
     let couponArry =  this.myForm['controls']['myCouponArray'].value;

     console.log('myForm data x',couponArry);
     let array1 = this.selection.selected;
     let array2 = couponArry;
     let merged = [];
     let selectedUsers = this.selection.selected;
     console.log('selectedUsers',this.selection.selected);

     let selectedUserId = []
   for(let i=0;i<selectedUsers.length;i++){
    selectedUserId.push(selectedUsers[i]['userId']);
   }

   let finaldata = {
    'selectedUsersId':selectedUserId,
    'giftingDetails':this.myForm.value
   }
   console.log('finaldata',finaldata);


//https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key
    //  for(let i=0;i<array1.length;i++){
    //   for(let j=0;i<array2.length;j++){
    //     merged.push({
    //       ...array1[i]['userId'], 
    //       ...array2[j]
    //      });
    //   }

     //return [ ...array1[i], ...array2 ];
  
    // }
    let arr3 = array1.map((item, i) => Object.assign({}, item, array2[i]));

    // let mergedArray = [ ...array1, ...array2 ];
     console.log('Merged Array: arr3', arr3);
    // console.log('Merged Array final: ', merged);

    }



    public demo1TabIndex = 0;
public demo1BtnClick() {
  
  const tabCount = 3;
  this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  console.log('demo1TabIndex',this.demo1TabIndex)
}


createCouponForm(){
  this.tableFormCoupon = this.fb.group({
    arrayForm: this.fb.array(this.CouponJsonData.map(r => this.fb.group(r)))
  });
}


couponData(){
 this.CouponJsonData = [
    {
        "couponId": 371,
        "couponTitle": "Transaction Discount Amount 20 in coupon",
        "discountType": "TRANSACTION_DISCOUNT_AMOUNT",
        "discountValue": 20,
        "createdBy": "admin",
        "modifiedTime": "2021-07-13 16:35:00",
        "startDate": "2021-07-13",
        "endDate": "2021-07-21",
        "status": "ONLINE",
        "modifiedUserId": 1,
        "modifiedUserName": "admin",
        "couponType": "TYPE2",
        "createdOn": "2021-07-13 16:35:00",
        "codeGenerationType": "GENERIC"
    },
    {
        "couponId": 371,
        "couponTitle": "Transaction Discount Amount 20 in coupon",
        "discountType": "TRANSACTION_DISCOUNT_AMOUNT",
        "discountValue": 20,
        "createdBy": "admin",
        "modifiedTime": "2021-07-13 16:35:00",
        "startDate": "2021-07-13",
        "endDate": "2021-07-21",
        "status": "ONLINE",
        "modifiedUserId": 1,
        "modifiedUserName": "admin",
        "couponType": "TYPE2",
        "createdOn": "2021-07-13 16:35:00",
        "codeGenerationType": "GENERIC"
    }

  ]

  
}


  }