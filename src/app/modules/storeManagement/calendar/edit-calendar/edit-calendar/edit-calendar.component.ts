import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router,ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, NgForm } from '@angular/forms';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export interface UserData {
  storeOid: number;
  storeName: string;
  address: string;
}

@Component({
  selector: 'edit-calendar',
  templateUrl: './edit-calendar.component.html',
  styleUrls: ['./edit-calendar.component.scss']
})
export class EditCalendarComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Calendar',
        link: ''
    }
    ];

  public buildFlag=false;
  calendarFormGroup:FormGroup;
  public statusValue:string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public disabled ;
  selectCalendarType = 'Set Business Hours';
  public holidayType:boolean ;
  businessHours = [];
  deliveryHours = [];
  public oid:string;
  public viewData:any;
  public toggleVal;
  public selectedCount = 0;
  public countryList:any;
  public currenctDate:any;
  public festivalWeekDays=[];
  public calendarType:string;
  public weekDays=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  showError=false;
  public deliveryCloseTimeRequired=[];
  public deliveryOpenTimeRequired=[];
  public businessCloseTimeRequired=[];
  public businessOpenTimeRequired=[];
  public totalCount:number=0;
  public storeCountTotal:any=2000;

  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("updateCalendarForm") updateCalendarForm;
  BrandList=[];
  brand;
  
  constructor(
    public dialog: MatDialog,private router: Router,private http: HttpService,private fb: FormBuilder,public snackBar: MatSnackBar) {
      this.currenctDate = new Date();
    this.dataSource = new MatTableDataSource();
   
  }
  ngOnInit() {
    let data=localStorage.getItem('CalendarEditID');
    if(data){
      this.oid=data;
      this.getBrandList();
      this.getCalendar();
      this.getCountryList();
      localStorage.removeItem('CalendarEditID')
    }else{
      sessionStorage.clear();
      this.router.navigate(['search-calendar']);
    }
   
  }
  public setCalendarType(value:string){
    this.calendarType=value;
 
    if(this.calendarType=='BUSINESS_HOURS'){
     this.removeValidation();
     this.removeBusinessDays();
     this.removeDeliveryDays();
     this.addBusinessDays();
     this.addDeliveryDays();
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

  addBusinessHours() {
    this.businessHours.push(this.businessHours.length);
  }
  addDeliveryHours() {
    this.deliveryHours.push(this.deliveryHours.length);
  }
  removeBusinessHours(bhmsg:string) {
    this.businessHours.splice(this.businessHours.indexOf(bhmsg), 1);      
  }
  removeDeliveryHours (dhmsg:string){
    this.deliveryHours.splice(this.deliveryHours.indexOf(dhmsg), 1);  
  }

  public addBusinessDays(){
    
      for(let i=0;i<this.weekDays.length;i++){
        const control = <FormArray>this.calendarFormGroup.controls['businessTimings'];
           let newForm = this.fb.group({
               isHoliday: ['true',],
               openTime: ['',Validators.compose([Validators.required])],
               closeTime:['',Validators.compose([Validators.required])],
               addBusinessTimings:new FormArray([])
           });
           control.push(newForm);
    }
    
  }

  public addDeliveryDays(){
    
      for(let i=0;i<this.weekDays.length;i++){
        const control = <FormArray>this.calendarFormGroup.controls['deliveryTimings'];
           let newForm = this.fb.group({
               isHoliday: ['true',],
               openTime: ['',],
               closeTime:['',],
               addDeliveryTimings:new FormArray([])
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

addTimeSlot(control) { 
  control.addBusinessTimings.push(
    this.fb.group({
      addOpenTime: ['',Validators.compose([Validators.required])],
      addCloseTime:['',Validators.compose([Validators.required])]
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



        public getCalendar(){
          // this.oid = this.router.url.split('edit-calendar/')[1];
          let data={
            "calendarOid" : parseFloat(this.oid)
          }
          this.http.postJson(environment.APIEndpoint+"api/rpa/calendar/v1/view", data).subscribe(res=>{
            this.viewData=res;
            this.buildCalendarForm(res);
            this.calendarType=res["calendarType"];
            this.dataSource.data=res["stores"];
            this.toggleVal = res["status"] == "ONLINE" ? true : false;
            this.checked = res['status']=='ONLINE'?true:false;
            this.imgUpload = true;
            this.selectedCount = res["selectedStoreCount"];
            this.totalCount = res["totalStoreCount"];
      })
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

       public buildCalendarForm(viewData:any){
          if(viewData.length!=0){
            this.buildFlag=true;
            let brandOid;
            if(viewData.brandOid!= null){
              brandOid = viewData.brandOid.toString();
            }
            this.calendarFormGroup=this.fb.group({
              calendarType:[viewData.calendarType,Validators.compose([Validators.required])],
              countryId:[viewData.country.countryOid.toString(),Validators.compose([Validators.required])],
              calendarTitle:[viewData.calendarTitle,Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9 \s]*')])],
              startDate:[viewData.startDate,],
              endDate:[viewData.endDate],
              businessTimings:this.fb.array([]),
              deliveryTimings:this.fb.array([]),
              brand:[brandOid]

            })

              if(viewData.businessHours!=null && viewData.businessHours.length!=0){
                for(let i=0;i<viewData.businessHours.length;i++){
                  this.festivalWeekDays.push(viewData.businessHours[i].weekDay);
                  const control = <FormArray>this.calendarFormGroup.controls['businessTimings'];
                  if(!viewData.businessHours[i].isHoliday){
                    let newForm = this.fb.group({
                      isHoliday: [false,],
                      openTime: ['',],
                      closeTime:['',],
                      addBusinessTimings:this.fb.array([])
                  });
                  control.push(newForm);
                  }else{
                    let editStartTime= new Date();
                    if(viewData.businessHours[i].storeTimings[0].openTime!=null){
                        let s = viewData.businessHours[i].storeTimings[0].openTime.split(":");
                        editStartTime.setHours(s[0]);
                        editStartTime.setMinutes(s[1]);
                    }
                    let editEndTime= new Date();
                    if(viewData.businessHours[i].storeTimings[0].closeTime!=null){
                        let e = viewData.businessHours[i].storeTimings[0].closeTime.split(":");
                        editEndTime.setHours(e[0]);
                        editEndTime.setMinutes(e[1]);
                    }
                    let newForm = this.fb.group({
                      isHoliday: [true,],
                      openTime: [editStartTime,],
                      closeTime:[editEndTime,],
                      addBusinessTimings:this.fb.array([])
                  });
                  control.push(newForm);
                    this.addBusinessTiming(control.controls[i],viewData.businessHours[i].storeTimings);
                  }  
                  
            }
              }    
              
              if(viewData.deliveryHours!=null && viewData.deliveryHours.length!=0){
                for(let i=0;i<viewData.deliveryHours.length;i++){
                  this.festivalWeekDays.push(viewData.deliveryHours[i].weekDay);
                  const control = <FormArray>this.calendarFormGroup.controls['deliveryTimings'];
                  if(!viewData.deliveryHours[i].isHoliday){
                    let newForm = this.fb.group({
                      isHoliday: [false,],
                      openTime: ['',],
                      closeTime:['',],
                      addDeliveryTimings:this.fb.array([])
                  });
                  control.push(newForm);
                  }else{
                    let editStartTime= new Date();
                    if(viewData.deliveryHours[i].storeTimings[0].openTime!=null){
                        let s = viewData.deliveryHours[i].storeTimings[0].openTime.split(":");
                        editStartTime.setHours(s[0]);
                        editStartTime.setMinutes(s[1]);
                    }
                    let editEndTime= new Date();
                    if(viewData.deliveryHours[i].storeTimings[0].closeTime!=null){
                        let e = viewData.deliveryHours[i].storeTimings[0].closeTime.split(":");
                        editEndTime.setHours(e[0]);
                        editEndTime.setMinutes(e[1]);
                    }
                    let newForm = this.fb.group({
                      isHoliday: [true,],
                      openTime: [editStartTime,],
                      closeTime:[editEndTime,],
                      addDeliveryTimings:this.fb.array([])
                  });
                  control.push(newForm);
                    this.addDeliveryTiming(control.controls[i],viewData.deliveryHours[i].storeTimings);
                  }      
                }
              }
              let business=this.calendarFormGroup.controls['businessTimings'] as FormArray
              for (let i = 0; i < business.length; i++) {
                if(business.at(i).get('isHoliday').value){
                    business.at(i).get('openTime').setValidators([Validators.required]);
                    business.at(i).get('openTime').updateValueAndValidity();
                    business.at(i).get('closeTime').setValidators([Validators.required]);
                    business.at(i).get('closeTime').updateValueAndValidity();
                }
              }
              let delivery=this.calendarFormGroup.controls['deliveryTimings'] as FormArray
              for (let i = 0; i < delivery.length; i++) {
                if(delivery.at(i).get('isHoliday').value){
                  delivery.at(i).get('openTime').setValidators([Validators.required]);
                  delivery.at(i).get('openTime').updateValueAndValidity();
                  delivery.at(i).get('closeTime').setValidators([Validators.required]);
                  delivery.at(i).get('closeTime').updateValueAndValidity();
                }
              }
          }
       }

       

        public addBusinessTiming(control,storeTiming){
                 for (let i = 0; i < storeTiming.length; i++) {
                   if(i!=0){
                    let editEndTime= new Date();
                    if(storeTiming[i].closeTime!=null){
                        let e = storeTiming[i].closeTime.split(":");
                        editEndTime.setHours(e[0]);
                        editEndTime.setMinutes(e[1]);
                    }
                    let editStartTimes= new Date();
                    if(storeTiming[i].openTime!=null){
                        let s = storeTiming[i].openTime.split(":");
                        editStartTimes.setHours(s[0]);
                        editStartTimes.setMinutes(s[1]);
                    }
                    const array = <FormArray>control.controls['addBusinessTimings'];
                    let arr = this.fb.group({
                      addOpenTime: [editStartTimes,Validators.compose([Validators.required])],
                      addCloseTime:[editEndTime,Validators.compose([Validators.required])],
                    });
                    array.push(arr); 
                   }
                 }   
        }

        public addDeliveryTiming(control,storeTiming){
          for (let i = 0; i < storeTiming.length; i++) {
            if(i!=0){
             let editStartTime= new Date();
             if(storeTiming[i].openTime!=null){
                 let s = storeTiming[i].openTime.split(":");
                 editStartTime.setHours(s[0]);
                 editStartTime.setMinutes(s[1]);
             }
             let editEndTime= new Date();
             if(storeTiming[i].closeTime!=null){
                 let e = storeTiming[i].closeTime.split(":");
                 editEndTime.setHours(e[0]);
                 editEndTime.setMinutes(e[1]);
             }
             const array = <FormArray>control.controls['addDeliveryTimings'];
             let arr = this.fb.group({
               openTime: [editStartTime,Validators.compose([Validators.required])],
               closeTime:[editEndTime,Validators.compose([Validators.required])],
             });
             array.push(arr); 
            }
          }   
        }

        public calulateFestivalDays(formData:any){
          let startDate=moment(formData.startDate);
          let endDate=moment(formData.endDate);
          let diff=endDate.diff(startDate,'days')+1;
          let startDay:number=startDate.day();
          let endDay:number=endDate.day();
          
          if(formData.startDate!='' && formData.endDate!='' && formData.calendarType=='FESTIVAL_HOURS'){
            this.festivalWeekDays=[];
              for (let i= 0; i < diff; i++) {
                this.festivalWeekDays[i]=this.weekDays[startDay];
                if(startDay>=6){
                  startDay=0;
                }else{
                  startDay++;
                }
             }
            this.addBusinessDays();
            this.addDeliveryDays();
           }
        }

getCountryList() {
  let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
          this.countryList = response;
      })
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

public cloneTime(formData:any){
    const control= this.calendarFormGroup.get('businessTimings') as FormArray;
    for(let i=0;i<formData.businessTimings.length;i++){
      if(i!=0){
        control.at(i).get('isHoliday').patchValue(formData.businessTimings[0].isHoliday)
        control.at(i).get('openTime').patchValue(formData.businessTimings[0].openTime);
        control.at(i).get('closeTime').patchValue(formData.businessTimings[0].closeTime);
        this.changeValidation(control.at(i),i);
        this.removeBusinessTiming(control.at(i).get('addBusinessTimings'));
          if(formData.businessTimings[0].addBusinessTimings.length!=0){
            const addTime= control.at(i).get('addBusinessTimings') as FormArray;
               for(let j=0;j<formData.businessTimings[0].addBusinessTimings.length;j++){
                this.addBusinessTime(addTime,formData.businessTimings[0].addBusinessTimings[j].addOpenTime,formData.businessTimings[0].addBusinessTimings[j].addCloseTime);
               }
             
          }
      }
    }
  
    const control1= this.calendarFormGroup.get('deliveryTimings') as FormArray;
    for(let i=0;i<formData.deliveryTimings.length;i++){
      if(i!=0){
        control1.at(i).get('isHoliday').patchValue(formData.deliveryTimings[0].isHoliday)
        control1.at(i).get('openTime').patchValue(formData.deliveryTimings[0].openTime);
        control1.at(i).get('closeTime').patchValue(formData.deliveryTimings[0].closeTime);
        this.changeValidation(control1.at(i),i);
        this.removeBusinessTiming(control1.at(i).get('addDeliveryTimings'));
          if(formData.deliveryTimings[0].addDeliveryTimings.length!=0){
            const addTime= control1.at(i).get('addDeliveryTimings') as FormArray;
               for(let j=0;j<formData.deliveryTimings[0].addDeliveryTimings.length;j++){
                this.addDeliveryTime(addTime,formData.deliveryTimings[0].addDeliveryTimings[j].openTime,formData.deliveryTimings[0].addDeliveryTimings[j].closeTime);
               }
          }
      }
    }

}

addBusinessTime(control,openTime,closeTime) { 
  control.push(
    this.fb.group({
      addOpenTime: [openTime,Validators.compose([Validators.required])],
      addCloseTime:[closeTime,Validators.compose([Validators.required])]
  }))
}

addDeliveryTime(control,openTime,closeTime) { 
  control.push(
    this.fb.group({
      openTime: [openTime,Validators.compose([Validators.required])],
      closeTime:[closeTime,Validators.compose([Validators.required])]
  }))
}

removeBusinessTiming(control){
  while (control.length) {
    control.removeAt(control.length-1);
  }
  return true;
}

updateCalendar(formData:any){
  if (this.calendarFormGroup.invalid == true){
    this.showError = true;

//     for (let i = 0; i < formData.deliveryTimings.length; i++){
//      if(formData.deliveryTimings[i].addDeliveryTimings.length!=0){
//       for (let j = 0; j < formData.deliveryTimings[i].addDeliveryTimings.length; j++){
//         if(formData.deliveryTimings[i].addDeliveryTimings[j].openTime.length==0 ||formData.deliveryTimings[i].addDeliveryTimings[j].closeTime.length){
//           this.deliveryOpenTimeRequired[i]=true;
//           this.deliveryCloseTimeRequired[i]=true;
//       }else{
//           this.deliveryOpenTimeRequired[i]=false;
//           this.deliveryCloseTimeRequired[i]=false;
//       }
//       }
//      }
// }

// for (let i = 0; i < formData.businessTimings.length; i++){
//  if(formData.businessTimings[i].addBusinessTimings.length!=0){
//   for (let j = 0; j < formData.businessTimings[i].addBusinessTimings.length; j++){
//     if(formData.businessTimings[i].addBusinessTimings[j].addOpenTime.length==0 ||formData.businessTimings[i].addBusinessTimings[j].addCloseTime.length){
//       this.businessOpenTimeRequired[i]=true;
//       this.businessCloseTimeRequired[i]=true;
//   }else{
//       this.businessOpenTimeRequired[i]=false;
//       this.businessCloseTimeRequired[i]=false;
//   }
//   }
//  }
// }

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
             openTime:moment(formData.businessTimings[i].addBusinessTimings[j].addOpenTime).format('HH:mm'),
             closeTime:moment(formData.businessTimings[i].addBusinessTimings[j].addCloseTime).format('HH:mm')
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
     calendarOid: this.oid,
     calendarType:formData.calendarType,
     calendarTitle:formData.calendarTitle,
     countryOid:formData.countryId,
     startDate:formData.startDate!=''?moment(formData.startDate).format('YYYY-MM-DD'):'',
     endDate:formData.endDate!=''?moment(formData.endDate).format('YYYY-MM-DD'):'',
     businessHours:businessHoursarray,
     deliveryHours:deliveryHoursarray,
     status:this.toggleVal==true ? 'ONLINE' : 'OFFLINE',
     storeOids:selectedStorearray,
     brandOid:formData.brand
 }
     let CREATE_CALENDAR= environment.APIEndpoint +"api/rpa/calendar/v1/update";
     this.http.postJson(CREATE_CALENDAR, request)
     .subscribe((response) => {
         this.snackBar.openFromComponent(SnackBarComponent, {
         duration: 1500,
         data: {
             status: "success",
             message: "Calendar event has been updated successfully"
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
getBrandList(){
  // this.BrandList=['AAA', 'BBB', 'CCC'];

  let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
  this.http.getJson(GET_ALL_ONLINE_BRANDS)
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
  
      // console.log(this.BrandList['brandName']);
      // console.log(this.BrandList['brandId']);
    },
      (error) => {
        console.log(error);
      });
}

}
