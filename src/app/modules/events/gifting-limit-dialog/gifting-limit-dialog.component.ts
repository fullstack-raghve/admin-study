import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: 'app-gifting-limit-dialog',
  templateUrl: './gifting-limit-dialog.component.html',
  styleUrls: ['./gifting-limit-dialog.component.scss']
})
export class GiftingLimitDialogComponent implements OnInit {

giftingDetails = [];
clikedUserID:any;
//getProduct = [];
myForm:FormGroup;
  popupdata: any[];

  getCoupons = [];
  getProduct = [];
  public users:any;
  couponsgiftingLimitsArry: any;
  programgiftingLimitsArry: any;
  productgiftingLimitsArry: any;
  couponCount_length: any;
  couponArray: any;



  // constructor(private fb:FormBuilder) { }

  constructor(private fb: FormBuilder,private router: Router,public dialog: MatDialog, 
    private https: HttpService,private http: HttpClient,
    private dialogRef: MatDialogRef<MatDialog>,
   // public dialogRef2: MatDialogRef<UserLocationDialogComponent>,
  //  @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
    
    ){


  }



//ngonit start
  ngOnInit() {
    console.log('clikedUserID>>>',this.clikedUserID);
    console.log('giftingDetails>>>',this.giftingDetails);


    for(let i=0;i<this.giftingDetails.length;i++){
     // console.log('fullusersGifting 0>>>',fullusersGifting[0].userOid);

         if(this.giftingDetails[i]['userOid'].includes(this.clikedUserID)){
            console.log('matched usr data',this.giftingDetails[i]);
            
           this.couponArray =  this.giftingDetails[i]['couponsgiftingLimits'];

            let couponCount =  this.giftingDetails[i]['couponsgiftingLimits'];
            this.couponCount_length =  couponCount.length;

         }
    }

   // this.popupdata = this.giftingDetails[0];


    let couponCount = this.giftingDetails[0].couponsgiftingLimits.length;
    let programCount = this.giftingDetails[0].productgiftingLimits.length;
    let productCount = this.giftingDetails[0].programgiftingLimits.length;


 
    //let addProgramcount = this.popupdata.getProgram.length;
  
     //  let productCount_dynamic = this.popupdata.getProduct.length;
 
    //   console.log('product count',productCount_dynamic);
 
    //   console.log('product data on popup',productCount_dynamic);
 
       this.myForm = this.fb.group({
         
         myCouponArray: this.fb.array([...this.createCoupons(this.couponCount_length)]),
         myProgramArray: this.fb.array([...this.createProgram(programCount)]),
         myProductArray: this.fb.array([...this.createProduct(productCount)])
      
       });
 
 
 
     this.patch();
}
//ngonit end
fields: any;

patch() {

  //console.log('product name',this.popupdata.getProduct);

//  const control = <FormArray>this.myForm.get('myCouponArray');
//   this.valueFromBackend.forEach(x => {
//     control.push(this.patchValues(x.couponId))
//   })

// for(let i =0;i<this.giftingDetails.length;i++){
   
//   for(let j =0;j<this.giftingDetails[i].couponsgiftingLimits.length;j++){

//     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['giftType'].patchValue('Coupon');
//     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['couponName'].patchValue('base program');
//     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['productOID'].patchValue(1);
//     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['maxGiftPerCustomer'].patchValue(this.giftingDetails[i].couponsgiftingLimits[i]['maxGiftPerCustomer']);
//     this.myForm['controls']['myCouponArray']['controls'][j]['controls']['maxGiftPerEvent'].patchValue(this.giftingDetails[i].couponsgiftingLimits[i]['maxGiftPerEvent']);

//   }

// }

for(let i=0;i<this.couponArray.length;i++){
  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['giftType'].patchValue('COUPON');
  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue('base program');
  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['productOID'].patchValue(1);
  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerCustomer'].patchValue(this.couponArray[i]['maxGiftPerCustomer']);
  this.myForm['controls']['myCouponArray']['controls'][i]['controls']['maxGiftPerEvent'].patchValue(this.couponArray[i]['maxGiftPerEvent']);

}



  for(let i =0;i<this.giftingDetails[0].couponsgiftingLimits.length;i++){
   /// this.myForm['controls']['myCouponArray']['controls'][i]['controls']['couponName'].patchValue(this.getCoupons[i]['couponTitle']);


  }
  
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
    giftType: '',
    couponName: '',
    maxGiftPerCustomer: '',
    maxGiftPerEvent: '',
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
    maxGiftPerCustomer: '',
    maxGiftPerEvent: '',
    productOID:''
  });
}


closepopup(){

  let couponGiftingData = this.myForm.get('myCouponArray').value;
      let programgiftingData = this.myForm.get('myProgramArray').value;
      let productgiftingData = this.myForm.get('myProductArray').value;


      if(couponGiftingData.length>0){
        this.couponsgiftingLimitsArry = couponGiftingData;
        this.couponsgiftingLimitsArry.map(res =>{

           res["giftcode"] = +res['productOID'];
           res['productName'] = '';
           res['variantName'] = '';
           res['productOID'] = '';
           res['variantOid'] =  '';
           res['language_code'] = '';
           res['maxGiftPerCustomer'] = +res['maxGiftPerCustomer'];
           res['maxGiftPerEvent'] = +res['maxGiftPerEvent'];
            delete res['couponName'];

          })
       }


  this.users = {
    'userOid':[this.clikedUserID],
    'couponsgiftingLimits':this.couponsgiftingLimitsArry ? this.couponsgiftingLimitsArry : [],
    'programgiftingLimits':this.programgiftingLimitsArry ? this.programgiftingLimitsArry : [],
    'productgiftingLimits':this.productgiftingLimitsArry ? this.productgiftingLimitsArry : []
 
    }


    console.log('user final arry>>>',this.users);


    this.dialogRef.close({ event: 'close',
    'buttonName': 'SELECT',
    //'tableData': this.selection.selected,
   // 'totalCount':this.resultsLength,
    'jsondata':this.users
   
   });
}


}