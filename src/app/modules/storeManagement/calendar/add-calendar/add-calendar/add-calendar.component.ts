import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export interface UserData {
  storeOid: number;
  storeName: string;
  address: string;

}
@Component({
  selector: 'add-calendar',
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.scss']
})
export class AddCalendarComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Calendar',
        link: ''
    }
    ];
  public startDate:Date;
  public endDate:Date;
  public statusValue:string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public disabled ;
  public holidayType:boolean ;
  businessHours = [];
  deliveryHours = [];
  showError=false;
  public currenctDate;

  public countryList:any;
  public calendarType:string="BUSINESS_HOURS";
  public weekDays=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  public festivalWeekDays=[];
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("createCalendarForm")createCalendarForm;
  public calendarFormGroup:FormGroup;
  public totalCount:number=0;
  public storeCountTotal:any=2000;
  public selectedStorearray=[];
  public deliveryCloseTimeRequired=[];
  public deliveryOpenTimeRequired=[];
  public businessCloseTimeRequired=[];
  public businessOpenTimeRequired=[];
  BrandList=[];
  constructor(
    public dialog: MatDialog,private fb: FormBuilder,private https: HttpService,public snackBar: MatSnackBar,private router: Router) {
      this.buildCalendarForm();
      this.currenctDate = new Date();
      this.dataSource = new MatTableDataSource();
      let data = {
        "order": {
          "column": "storeId",
          "dir": "asc"
        },
        "keySearch": "",
        "fieldSearch": [
          {
            "fieldName": "mall.city.oid",
            "fieldValue": "",
          },
          {
            "fieldName": "mall.city.country.oid",
            "fieldValue": "",
          },
        ]
      }

      this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
        this.totalCount = res["totalCount"];
        this.storeCountTotal=res["totalCount"];
     });

  }

  public setCalendarType(value:string){
   this.calendarType=value;

   if(this.calendarType=='BUSINESS_HOURS'){
    this.removeBusinessDays();
    this.removeDeliveryDays();
    this.addBusinessDays();
    this.addDeliveryDays();
    this.removeValidation();
   }else if(this.calendarType!='BUSINESS_HOURS'){
    this.removeBusinessDays();
    this.removeDeliveryDays();
    this.addBusinessDays();
    this.addDeliveryDays();
    this.addValidation();
   }

   if(this.calendarType=='HOLIDAY'){
    this.removeBusinessDays();
    this.removeDeliveryDays();
  }

  }
  
  ngOnInit() {
    this.buildCalendarForm();
    this.getCountryList();
    this.addBusinessDays();
    this.addDeliveryDays();
    this.getBrandList();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.dataSource.data.map(a => a.storeOid);
    dialogRef.componentInstance.totalCount=this.storeCountTotal;
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data=result.tableData ? result.tableData : '';
    });
  }

  public toggleStatus(event){
    if(event.checked==true){
        this.statusValue='ONLINE';
    }else{
         this.statusValue='OFFLINE';
    }

}

public addValidation(){
    this.calendarFormGroup.get('startDate').setValidators([Validators.required]);
    this.calendarFormGroup.get('startDate').updateValueAndValidity();
    this.calendarFormGroup.get('endDate').setValidators([Validators.required]);
    this.calendarFormGroup.get('endDate').updateValueAndValidity();
}

public removeValidation(){
   this.calendarFormGroup.get('startDate').clearValidators();
    this.calendarFormGroup.get('startDate').updateValueAndValidity();
    this.calendarFormGroup.get('endDate').clearValidators();
    this.calendarFormGroup.get('endDate').updateValueAndValidity();
}

getCountryList() {
  let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
          this.countryList = response;
      })
}

public buildCalendarForm(){
  this.calendarFormGroup=this.fb.group({
    calendarType:["BUSINESS_HOURS",Validators.compose([Validators.required])],
    countryId:['',Validators.compose([Validators.required])],
    calendarTitle:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9 \s]*')])],
    startDate:[''],
    endDate:[''],
    businessTimings:this.fb.array([]),
    deliveryTimings:this.fb.array([]),
    brand:['']

  })
}

public addBusinessDays(){
    for(let i=0;i<this.weekDays.length;i++){
      const control = <FormArray>this.calendarFormGroup.controls['businessTimings'];
         let newForm = this.fb.group({
             isHoliday: [true,],
             openTime: ['',Validators.compose([Validators.required])],
             closeTime:['',Validators.compose([Validators.required])],
             addBusinessTimings:new FormArray([])
         });
         control.push(newForm);
  }
  
}

public removeBusinessDays(){
      const control = <FormArray>this.calendarFormGroup.controls['businessTimings'];
      while (control.length) {
        control.removeAt(control.length-1);
      }
}

public removeDeliveryDays(){
  const control = <FormArray>this.calendarFormGroup.controls['deliveryTimings'];
  while (control.length) {
    control.removeAt(control.length-1);
  }
}

public addDeliveryDays(){
 
    for(let i=0;i<this.weekDays.length;i++){
      const control = <FormArray>this.calendarFormGroup.controls['deliveryTimings'];
         let newForm = this.fb.group({
             isHoliday: [true,],
             openTime: ['',Validators.compose([Validators.required])],
             closeTime:['',Validators.compose([Validators.required])],
             addDeliveryTimings:new FormArray([]),
         });
         control.push(newForm);
  }
}

addTimeSlot(control) { 
  control.addBusinessTimings.push(
    this.fb.group({
      openTime: ['',Validators.compose([Validators.required])],
      closeTime:['',Validators.compose([Validators.required])]
  }))
}

addTimeSlot1(control) { 
  control.addDeliveryTimings.push(
    this.fb.group({
      openTime: ['',Validators.compose([Validators.required])],
      closeTime:['',Validators.compose([Validators.required])]
  }))
}

removeBusinessTimeSlot(control1,i,j) {
  const control= this.calendarFormGroup.get('businessTimings') as FormArray;
  const addTime= control.at(i).get('addBusinessTimings') as FormArray;
  addTime.removeAt(j)
 //control1.splice(index,1);
}

removeDeliveryTimeSlot(control1,i,j) {
  const control= this.calendarFormGroup.get('deliveryTimings') as FormArray;
  const addTime= control.at(i).get('addDeliveryTimings') as FormArray;
  addTime.removeAt(j)
 //control1.splice(index,1);
}

public changeValidation(controll,index){
 if(!controll.get('isHoliday').value){
  controll.get('openTime').clearValidators();
  controll.get('openTime').updateValueAndValidity();
  controll.get('closeTime').clearValidators();
  controll.get('closeTime').updateValueAndValidity();
 }else{
  controll.get('openTime').setValidators([Validators.required]);
  controll.get('openTime').updateValueAndValidity();
  controll.get('closeTime').setValidators([Validators.required]);
  controll.get('closeTime').updateValueAndValidity();
 }
}

// public calulateFestivalDays(formData:any){
//   let startDate=moment(formData.startDate);
//   let endDate=moment(formData.endDate);
//   let diff=endDate.diff(startDate,'days')+1;
//   let startDay:number=startDate.day();
//   let endDay:number=endDate.day();
  
//   if(formData.startDate!='' && formData.endDate!='' && formData.calendarType=='FESTIVAL_HOURS'){
//     this.festivalWeekDays=[];
//       for (let i= 0; i < diff; i++) {
//         this.festivalWeekDays[i]=this.weekDays[startDay];
//         if(startDay>=6){
//           startDay=0;
//         }else{
//           startDay++;
//         }
//      }
//     this.addBusinessDays();
//     this.addDeliveryDays();
//    }
// }

public createCalendar(formData:any){
  if (this.calendarFormGroup.invalid == true){
     this.showError = true;
  }
  else {
    let businessHoursarray=[];
    let deliveryHoursarray=[];
    if(formData.businessTimings.length!=0){
      for (let i = 0; i < formData.businessTimings.length; i++) {
        let businessstoreTimings=[];
        let timeBody:any;
        timeBody ={
          openTime:moment(formData.businessTimings[i].openTime).format('HH:mm'),
          closeTime:moment(formData.businessTimings[i].closeTime).format('HH:mm')
        }
        businessstoreTimings.push(timeBody);
        for (let j = 0; j < formData.businessTimings[i].addBusinessTimings.length; j++) {
            let timeBody={
              openTime:moment(formData.businessTimings[i].addBusinessTimings[j].openTime).format('HH:mm'),
              closeTime:moment(formData.businessTimings[i].addBusinessTimings[j].closeTime).format('HH:mm')
            }
            businessstoreTimings.push(timeBody);
        }
        let body={
          weekDay:this.weekDays[i]=='SUN'?'SUNDAY':this.weekDays[i]=='MON'?'MONDAY':this.weekDays[i]=='TUE'?'TUESDAY':this.weekDays[i]=='WED'?'WEDNESDAY':this.weekDays[i]=='THU'?'THURSDAY':this.weekDays[i]=='FRI'?'FRIDAY':'SATURDAY',
          isHoliday:formData.businessTimings[i].isHoliday,
          storeTimings:businessstoreTimings
      }
        businessHoursarray.push(body);
      }
    }
    
      if(formData.deliveryTimings.length!=0){
        for (let i = 0; i < formData.deliveryTimings.length; i++) {
          let deliverystoreTimings=[];
          let timeBody:any;
          timeBody ={
            openTime:moment(formData.deliveryTimings[i].openTime).format('HH:mm'),
            closeTime:moment(formData.deliveryTimings[i].closeTime).format('HH:mm')
          }
          deliverystoreTimings.push(timeBody);
          for (let j = 0; j < formData.deliveryTimings[i].addDeliveryTimings.length; j++) {
            timeBody ={
                openTime:moment(formData.deliveryTimings[i].addDeliveryTimings[j].openTime).format('HH:mm'),
                closeTime:moment(formData.deliveryTimings[i].addDeliveryTimings[j].closeTime).format('HH:mm')
              }
              deliverystoreTimings.push(timeBody);
          }

          let body={
            weekDay:this.weekDays[i]=='SUN'?'SUNDAY':this.weekDays[i]=='MON'?'MONDAY':this.weekDays[i]=='TUE'?'TUESDAY':this.weekDays[i]=='WED'?'WEDNESDAY':this.weekDays[i]=='THU'?'THURSDAY':this.weekDays[i]=='FRI'?'FRIDAY':'SATURDAY',
            isHoliday:formData.deliveryTimings[i].isHoliday,
            storeTimings:deliverystoreTimings
        }
        deliveryHoursarray.push(body);
        }
      }
      let selectedStorearray = this.dataSource.data.map(a => a.storeOid)


    let request={
      calendarType:formData.calendarType,
      calendarTitle:formData.calendarTitle,
      countryOid:formData.countryId,
      startDate:formData.startDate!=''?moment(formData.startDate).format('YYYY-MM-DD'):'',
      endDate:formData.endDate!=''?moment(formData.endDate).format('YYYY-MM-DD'):'',
      businessHours:businessHoursarray,
      deliveryHours:deliveryHoursarray,
      status:this.statusValue,
      storeOids:selectedStorearray,
      brandOid:formData.brand
  }
      let CREATE_CALENDAR= environment.APIEndpoint +"api/rpa/calendar/v1/create";
      this.https.postJson(CREATE_CALENDAR, request)
      .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
              status: "success",
              message: "Calendar event has been created successfully"
          }
      });
      sessionStorage.clear();
     this.router.navigate(['search-calendar']);
    }
    ,err => {
      if(err.error.errorType=='VALIDATION'){
          this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
              }
          });
      }else{
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

  public cloneTime(formData:any){
      const control= this.calendarFormGroup.get('businessTimings') as FormArray;
      for(let i=0;i<formData.businessTimings.length;i++){
        if(i!=0){
          control.at(i).get('openTime').patchValue(formData.businessTimings[0].openTime);
          control.at(i).get('closeTime').patchValue(formData.businessTimings[0].closeTime);
          control.at(i).get('isHoliday').patchValue(formData.businessTimings[0].isHoliday);
            this.changeValidation(control.at(i),i);
          this.removeBusinessTiming(control.at(i).get('addBusinessTimings'));
            if(formData.businessTimings[0].addBusinessTimings.length!=0){
              const addTime= control.at(i).get('addBusinessTimings') as FormArray;
                 for(let j=0;j<formData.businessTimings[0].addBusinessTimings.length;j++){
                  this.addBusinessTime(addTime,formData.businessTimings[0].addBusinessTimings[j].openTime,formData.businessTimings[0].addBusinessTimings[j].closeTime);
                 }
            }
        }
      }

      const control1= this.calendarFormGroup.get('deliveryTimings') as FormArray;
      for(let i=0;i<formData.deliveryTimings.length;i++){
        if(i!=0){
          control1.at(i).get('openTime').patchValue(formData.deliveryTimings[0].openTime);
          control1.at(i).get('closeTime').patchValue(formData.deliveryTimings[0].closeTime);
          control1.at(i).get('isHoliday').patchValue(formData.deliveryTimings[0].isHoliday);
          this.changeValidation(control1.at(i),i);
          this.removeBusinessTiming(control1.at(i).get('addDeliveryTimings'));
            if(formData.deliveryTimings[0].addDeliveryTimings.length!=0){
              const addTime= control1.at(i).get('addDeliveryTimings') as FormArray;
                 for(let j=0;j<formData.deliveryTimings[0].addDeliveryTimings.length;j++){
                  this.addBusinessTime(addTime,formData.deliveryTimings[0].addDeliveryTimings[j].openTime,formData.deliveryTimings[0].addDeliveryTimings[j].closeTime);
                 }
            }
        }
      }
  }

  addBusinessTime(control,openTime,closeTime) { 
    control.push(
      this.fb.group({
        openTime: [openTime,],
        closeTime:[closeTime,]
    }))
  }

  removeBusinessTiming(control){
    while (control.length) {
      control.removeAt(control.length-1);
    }
    return true;
  }
  getBrandList(){
    // this.BrandList=['AAA', 'BBB', 'CCC'];

    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        let brandList = response;

        for (let i = 0; i <= brandList.length - 1; i++) {
          let obj = {
            brandId: brandList[i]['brandId'],
            brandName: brandList[i]['brandName'],
          }
          console.log(obj);
          this.BrandList.push(obj);
        }
    
        console.log(this.BrandList['brandName']);
        console.log(this.BrandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
}

  } 
