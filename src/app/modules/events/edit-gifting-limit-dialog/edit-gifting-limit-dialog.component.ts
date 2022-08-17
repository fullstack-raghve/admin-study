import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-gifting-limit-dialog',
  templateUrl: './edit-gifting-limit-dialog.component.html',
  styleUrls: ['./edit-gifting-limit-dialog.component.scss']
})
export class EditGiftingLimitDialogComponent implements OnInit {
giftingLimitsDummy: any;
///@ViewChild('userOid') userOid 
@Input('userOid') userOid;
@Input('mode') mode;
@Input('totalData') totalData = [];
//@Input('FINAL_OBJ') FINAL_OBJ = [];
@Input('isLive') isLive;

@Input('FINAL_OBJ_NEW_Copy') FINAL_OBJ_NEW_Copy = [];

giftData: any;
  MATCHED_FINAL_OBJ: any;
  myForm:FormGroup;
  couponArray: any;
  couponCount_length: any;
  couponsgiftingLimitsArry: any;
  programgiftingLimitsArry: any;
  productgiftingLimitsArry: any;
  users: any;
  programArray: any;
  productArray: any;
  programCount_length: any;
  productCount_length: any;

  FINAL_OBJ_old: any;
  FINAL_OBJ_NEW: any;
  //FINAL_OBJ_NEW_Copy: any;

  FINAL_OBJ_NEW1: any;

  couponResult: any;
  PROGRAMResult: any;
  PRODUCTResult: any;
  finalObj_at_index_userOid: any;
  finalObj_at_index: any = [];

  FINAL_OBJ: any;
  index: number;
  userOid_length: any;


  constructor(private fb: FormBuilder,private router: Router,public dialog: MatDialog, 
    private https: HttpService,private http: HttpClient,
    private dialogRef: MatDialogRef<MatDialog>,
   // public dialogRef2: MatDialogRef<UserLocationDialogComponent>,
   // @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
    
    )  { }

  // constructor(private fb:FormBuilder) { }

  ngOnInit() {
    console.log('userOid clicked>',this.userOid);
    console.log('total data on popup>',this.totalData);
    console.log('FINAL_OBJ_NEW_Copy on popp>',this.FINAL_OBJ_NEW_Copy);
  let x = this.FINAL_OBJ_NEW_Copy;
    this.FINAL_OBJ = x;

   // debugger
  //  let userId = +this.userOid;

  console.log('FINAL_OBJ >',this.FINAL_OBJ);

  this.userOid = this.userOid.toString();

    for(let i=0;i<this.FINAL_OBJ.length;i++){
      // console.log('fullusersGifting 0>>>',fullusersGifting[0].userOid);
 
          if(this.FINAL_OBJ[i]['userOid'].includes(this.userOid)){
             console.log('matched fFINAL_OBJ data',this.FINAL_OBJ[i]);
             console.log('index',i);
             this.index = i;
             this.FINAL_OBJ_old = this.FINAL_OBJ[i];
 
             this.finalObj_at_index.push(this.FINAL_OBJ[i]);
             this.finalObj_at_index_userOid = this.FINAL_OBJ[i]['userOid'];


            this.couponArray =  this.FINAL_OBJ[i]['couponsgiftingLimits'];
            this.programArray =  this.FINAL_OBJ[i]['programgiftingLimits'];
            this.productArray =  this.FINAL_OBJ[i]['productgiftingLimits'];

             let couponCount =  this.FINAL_OBJ[i]['couponsgiftingLimits'];

             this.couponCount_length =  couponCount.length;
             this.programCount_length =  this.FINAL_OBJ[i]['programgiftingLimits'].length;
             this.productCount_length =  this.FINAL_OBJ[i]['productgiftingLimits'].length;

             this.userOid_length = this.FINAL_OBJ[i]['userOid'].length;

             if(this.userOid_length>1){
                  console.log('length is if >>>',this.userOid_length);
                //  this.finalObj_at_index_userOid = this.finalObj_at_index_userOid.map(i=>Number(i))

            
                  

                  
              // this.FINAL_OBJ_NEW = {
              
             
              //   }

             }else{

            //  console.log('length is else >>>',userOid_length);
           
               
            //  this.finalObj_at_index.splice(i,1);
           //   console.log('this.FINAL_OBJ >>>',this.finalObj_at_index);

            //  this.FINAL_OBJ.splice(i,1);

             }

               break;
          } 
     }
 
    // this.popupdata = this.FINAL_OBJ[0];
 //debugger
 
    //  let couponCount = this.FINAL_OBJ[0].couponsgiftingLimits.length;
    //  let programCount = this.FINAL_OBJ[0].productgiftingLimits.length;
    //  let productCount = this.FINAL_OBJ[0].programgiftingLimits.length;
 

     this.myForm = this.fb.group({
         
      myCouponArray: this.fb.array([...this.createCoupons(this.couponCount_length)]),
      myProgramArray: this.fb.array([...this.createProgram( this.programCount_length)]),
      myProductArray: this.fb.array([...this.createProduct(this.productCount_length)])
   
    });



  this.patch();



  }



  patch() {

    console.log('couponArray---------',this.couponArray);
    console.log('programArray---------',this.programArray);
    console.log('productArray---------',this.productArray);

    for(let i=0;i<this.couponArray.length;i++){
    //  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['giftingType'].patchValue(this.couponArray[i]['giftingType']);
      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['giftingType'].patchValue('Coupon');

      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue(this.couponArray[i]['productName']);
      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['productOID'].patchValue(this.couponArray[i]['productOID']);
      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerCustomer'].patchValue(this.couponArray[i]['maxGiftPerCustomer']);
      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerEvent'].patchValue(this.couponArray[i]['maxGiftPerEvent']);
      this.myForm['controls']['myCouponArray']['controls'][i]['controls']['balance'].patchValue(this.couponArray[i]['balance']);

    }
    

    for(let i=0;i<this.programArray.length;i++){
      // this.myForm['controls']['myProgramArray']['controls'][i]['controls']['giftingType'].patchValue(this.programArray[i]['giftingType']);
      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['giftingType'].patchValue('Program');

      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['programName'].patchValue(this.programArray[i]['productName']);
      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['productOID'].patchValue(this.programArray[i]['productOID']);
      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['maxGiftPerCustomer'].patchValue(this.programArray[i]['maxGiftPerCustomer']);
      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['maxGiftPerEvent'].patchValue(this.programArray[i]['maxGiftPerEvent']);
      this.myForm['controls']['myProgramArray']['controls'][i]['controls']['balance'].patchValue(this.programArray[i]['balance']);

    }

    for(let i=0;i<this.productArray.length;i++){
      // this.myForm['controls']['myProductArray']['controls'][i]['controls']['giftingType'].patchValue(this.productArray[i]['giftingType']);
      this.myForm['controls']['myProductArray']['controls'][i]['controls']['giftingType'].patchValue('Product');

      this.myForm['controls']['myProductArray']['controls'][i]['controls']['productName'].patchValue(this.productArray[i]['productName']);
      this.myForm['controls']['myProductArray']['controls'][i]['controls']['productOID'].patchValue(this.productArray[i]['productOID']);
      this.myForm['controls']['myProductArray']['controls'][i]['controls']['maxGiftPerCustomer'].patchValue(this.productArray[i]['maxGiftPerCustomer']);
      this.myForm['controls']['myProductArray']['controls'][i]['controls']['maxGiftPerEvent'].patchValue(this.productArray[i]['maxGiftPerEvent']);
      this.myForm['controls']['myProductArray']['controls'][i]['controls']['balance'].patchValue(this.productArray[i]['balance']);

    }
  
    //console.log('product name',this.popupdata.getProduct);
  
  //  const control = <FormArray>this.myForm.get('myCouponArray');
  //   this.valueFromBackend.forEach(x => {
  //     control.push(this.patchValues(x.couponId))
  //   })
  
  // for(let i =0;i<this.FINAL_OBJ.length;i++){
     
  //   for(let j =0;j<this.FINAL_OBJ[i].couponsgiftingLimits.length;j++){
  
  //     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['giftingType'].patchValue('Coupon');
  //     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['couponName'].patchValue('base program');
  //     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['productOID'].patchValue(1);
  //     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['maxGiftPerCustomer'].patchValue(this.giftingDetails[i].couponsgiftingLimits[i]['maxGiftPerCustomer']);
  //     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['maxGiftPerEvent'].patchValue(this.giftingDetails[i].couponsgiftingLimits[i]['maxGiftPerEvent']);
  
  //   }
  
  // }
  

  
  
   // for(let i =0;i<this.giftingDetails[0].couponsgiftingLimits.length;i++){
     /// this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue(this.getCoupons[i]['couponTitle']);
  
  
  //  }
    
    //  for(let i =0;i<this.popupdata.getProgram.length;i++){
    //   this.myForm['controls']['myProgramArray']['controls'][i]['controls']['programName'].patchValue(this.popupdata.getProgram[i]['programName']);
    //   this.myForm['controls']['myProgramArray']['controls'][i]['controls']['productOID'].patchValue(this.popupdata.getProgram[i]['programID']);
  
    // }
  
    // for(let i =0;i<this.popupdata.getProduct.length;i++){
    //   this.myForm['controls']['myProductArray']['controls'][i]['controls']['productName'].patchValue(this.popupdata.getProduct[i]['productName']);
    //   this.myForm['controls']['myProductArray']['controls'][i]['controls']['productOID'].patchValue(this.popupdata.getProduct[i]['productVariantOid']);
  
    // }
  }
 
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  
  }
  
    
     private createCoupons(couponCountxx: number): FormGroup[] {
    let arr = [];
    for (let i = 0; i < couponCountxx; i++) {
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
  
  
  private createItemCoupon(): FormGroup {
    return this.fb.group({
      giftingType: '',
      couponName: '',
      maxGiftPerCustomer: ['',Validators.compose([Validators.required])],
      maxGiftPerEvent: ['',Validators.compose([Validators.required])],
      productOID:'',
      balance:''

    });
  }
  
  private createItemProgram(): FormGroup {
    return this.fb.group({
      giftingType: '',
      programName: '',
      maxGiftPerCustomer: ['',Validators.compose([Validators.required])],
      maxGiftPerEvent: ['',Validators.compose([Validators.required])],
      productOID:'',
      balance:''
    });
  }
  
  
  private createItemProduct(): FormGroup {
    return this.fb.group({
      giftingType: '',
      productName: '',
      maxGiftPerCustomer: ['',Validators.compose([Validators.required])],
      maxGiftPerEvent: ['',Validators.compose([Validators.required])],
      productOID:'',
      balance:''
    });
  }


  ///////////CLOSE POPUP
  save() {

    ////apply validation start
   /// this.submitform = true;
    
    if(this.couponArray.length>0){
     
      if(this.myForm.controls['myCouponArray'].invalid){
        return;
      }
    
    }
    
    if(this.programArray.length>0){
     
      if(this.myForm.controls['myProgramArray'].invalid){
        return;
      }
    
    }
    if(this.productArray.length>0){
     
      if(this.myForm.controls['myProductArray'].invalid){
        return;
      }
    
    }
    
    
    
    
    
    
    
    
    
    ///////////////end of validation
    
    
        //  let selectedUsers = this.selection.selected;
         /// console.log('selectedUsers>>>',selectedUsers);
    
    
          // if (this.popupdata.selectedUsers.length > 0) {
          //   this.result = selectedUsers.filter( el => (-1 == this.popupdata.selectedUsers.indexOf(el.userId)));
          //   //console.log(result);
          
          // console.log('result of new user>>>>', this.result);   
          
       
         
          // }else{
          //   this.result = this.selection.selected;
          // }
    
          // for(let i=0;i< this.result.length;i++){
          //   selectedUserId.push(this.result[i]['userId']);
          //   this.selectedUserIdnew.push(this.result[i]['userId']);
          //  }
         
        
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
    
    
          if(couponGiftingData.length>0){
            this.couponsgiftingLimitsArry = couponGiftingData;
            this.couponsgiftingLimitsArry.map(res =>{
    
               res["giftcode"] = +res['productOID'];
               res['productName'] = res['couponName'] ? res['couponName'] : '';
               res['variantName'] = '';
               res['productOID'] =  res['productOID'] ?  res['productOID'] : '';
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
             res['productOID'] = res['productOID'] ? res['productOID'] : '';
             res['variantOid'] =  '';
             res['language_code'] = '';
             res['maxGiftPerCustomer'] = +res['maxGiftPerCustomer'];
             res['maxGiftPerEvent'] = +res['maxGiftPerEvent'];
           //  delete res['programName'];
    
          })
       }
    
             this.FINAL_OBJ_NEW = {
              'userOid':[this.userOid],
              'couponsgiftingLimits':this.couponsgiftingLimitsArry ? this.couponsgiftingLimitsArry : [],
              'programgiftingLimits':this.programgiftingLimitsArry ? this.programgiftingLimitsArry : [],
              'productgiftingLimits':this.productgiftingLimitsArry ? this.productgiftingLimitsArry : []
           
              }
             // console.log('users gifting AFTER EDIT>>>',this.users);
              console.log('users gifting AFTER EDIT>>>',this.FINAL_OBJ_NEW);

              console.log('users gifting BEFORE EDIT>>>',this.FINAL_OBJ_old);


/////////////////compare COUPON START////////////////
var onlyInA = this.FINAL_OBJ_NEW['couponsgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_old['couponsgiftingLimits']));
var onlyInB = this.FINAL_OBJ_old['couponsgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_NEW['couponsgiftingLimits']));
this.couponResult = onlyInA.concat(onlyInB);

console.log('compare coupon length>>',this.couponResult); 

/////////////////compare COUPON end////////////////

/////////////////compare PROGRAM START////////////////
var onlyInC = this.FINAL_OBJ_NEW['programgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_old['programgiftingLimits']));
var onlyInD = this.FINAL_OBJ_old['programgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_NEW['programgiftingLimits']));

this.PROGRAMResult = onlyInC.concat(onlyInD);

console.log('compare PROGRAM length>>',this.PROGRAMResult); 

/////////////////compare PROGRAM end////////////////


/////////////////compare PRODUCT START////////////////
var onlyInE = this.FINAL_OBJ_NEW['productgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_old['productgiftingLimits']));
var onlyInF = this.FINAL_OBJ_old['productgiftingLimits'].filter(this.comparer(this.FINAL_OBJ_NEW['productgiftingLimits']));

this.PRODUCTResult = onlyInE.concat(onlyInF);

console.log('compare PRODUCT length>>',this.PRODUCTResult); 

/////////////////compare PRODUCT end////////////////

///////////coupon , program ,product check length

if(this.couponResult.length == 0 && this.PROGRAMResult.length == 0 && this.PRODUCTResult.length == 0) {
  console.log('no change by user');
  console.log('FINAL_OBJ_NEW_Copy----',this.FINAL_OBJ_NEW_Copy);

  this.dialogRef.close({ event: 'close',
  'data':'no',
  'final_obj': this.FINAL_OBJ_NEW_Copy
 });

}else{
  console.log('change by user');
  console.log('FINAL_OBJ_NEW',this.FINAL_OBJ_NEW);
  console.log('FINAL_OBJ_NEW1',this.FINAL_OBJ_NEW1);

  if(this.userOid_length>1){
    let new_userOid_index = this.finalObj_at_index_userOid.indexOf(this.userOid);
    this.finalObj_at_index_userOid.splice(new_userOid_index,1)
 ///  console.log('finaluseroidArray_after_splice let >>>',finaluseroidArray_after_splice);
   console.log('finaluseroidArray_after_splice this >>>',this.finalObj_at_index_userOid);

   this.FINAL_OBJ.splice(this.index,1);

  // this.finalObj_at_index.splice(this.index,1);
 // console.log('this.FINAL_OBJ >>>',this.finalObj_at_index);
 
   this.FINAL_OBJ_NEW1 = {
 'userOid':this.finalObj_at_index_userOid,
 'couponsgiftingLimits':this.couponArray,
 'programgiftingLimits': this.programArray,
 'productgiftingLimits':this.productArray
 }
 
 this.FINAL_OBJ.push(this.FINAL_OBJ_NEW1)

  }else{
    this.FINAL_OBJ.splice(this.index,1);

  }


 


 //// this.finalObj_at_index.push(this.FINAL_OBJ_NEW);
  this.FINAL_OBJ.push(this.FINAL_OBJ_NEW);

////  this.FINAL_OBJ_NEW1 ? this.finalObj_at_index.push(this.FINAL_OBJ_NEW1) : '';

console.log('final>>>',this.FINAL_OBJ);

  this.dialogRef.close({ event: 'close',
  'data':'yes',
  'final_obj': this.FINAL_OBJ

 });
//  return;

}



    
          //  this.dialogRef.close({ event: 'close',
          //  'buttonName': 'SELECT',
         
          //  'jsondata':this.users
          
          // });
    
   }
   getControlsmyCouponArray() {
    return (this.myForm.get('myCouponArray') as FormArray).controls;
  }
  getControlsmyProductArray() {
    return (this.myForm.get('myProductArray') as FormArray).controls;
  }
  getControlsmyProgramArray() {
    return (this.myForm.get('myProgramArray') as FormArray).controls;
  }

 comparer(otherArray){
          return function(current){
            return otherArray.filter(function(other){
              return other.maxGiftPerCustomer == current.maxGiftPerCustomer && other.maxGiftPerEvent == current.maxGiftPerEvent
            }).length == 0;
      }
  }
        
        
  closePOPup(){
    this.dialogRef.close({ event: 'close' });
 }
      
}
