import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { HttpService } from '../../../../../services/http-service';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
@Component({
  selector: 'delivery-charges',
  templateUrl: './delivery-charges.component.html',
  styleUrls: ['./delivery-charges.component.scss']
})

export class DeliveryChargesComponent implements OnInit {
  @ViewChild('createDeliveryChargesForm') createDeliveryChargesForm;
  createDeliveryChargesFormGroup: FormGroup;
  public statusValue:string = 'ONLINE';
  public toggleVal: boolean = true;
  public loading: boolean = false;
  public showError: boolean = false;
  deliveryList = [];
  createdResult = [];
  deliveryChargeAmountcheck: boolean = false;
  toCheck: boolean = false;
  fromCheck: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpService,
      private router: Router, public snackBar: MatSnackBar, private https: HttpService) {
        this.getDeliveryCharges();
  }

  ngOnInit() { 
  }

  public buildCreateDeliveryChargesForm(editData) {
    this.createDeliveryChargesFormGroup = this.fb.group({
      deliveryChargeOid: editData.deliveryChargeOid != undefined || editData.deliveryChargeOid != '' || editData.deliveryChargeOid != null ? editData.deliveryChargeOid : null,
      orderAmount: editData.orderAmount != undefined || editData.orderAmount != '' || editData.orderAmount != null ? editData.orderAmount : '',
      status: "ONLINE",
      deliveryChargeListArray: this.fb.array([])
    });
  }

  public deliverychargesForm() {
    const control = <FormArray>this.createDeliveryChargesFormGroup.controls['deliveryChargeListArray'];
      const newForm = this.fb.group({
        from: [''],
        to:[''],
        deliveryChargeAmount:[''],
        status:"ONLINE",
      });
      control.push(newForm);
  }

  onAdd(locale) {
    if((locale.value.deliveryChargeAmount != '' && locale.value.deliveryChargeAmount != null) && (locale.value.to != '' || locale.value.to == 0) && (locale.value.from != '' || locale.value.from == 0)){
        this.createdResult.push(locale.value);
        this.deliveryChargeAmountcheck = false;
        this.toCheck = false;
        this.fromCheck = false;
    }else{
      if(locale.value.deliveryChargeAmount == '' || locale.value.deliveryChargeAmount == null){
       this.deliveryChargeAmountcheck = true;
      }else{
        this.deliveryChargeAmountcheck = false;
      }

      if(locale.value.to == '' || locale.value.to != 0){
        this.toCheck = true;
       }else{
         this.toCheck = false;
       }

       if(locale.value.from == ''|| locale.value.from != 0 ){
        this.fromCheck = true;
       }else{
         this.fromCheck = false;
       }
    }
    this.reset()
  }

  validateCharge(locale){
    if(locale.value.deliveryChargeAmount == ''){
      this.deliveryChargeAmountcheck = true;
     }else{
       this.deliveryChargeAmountcheck = false;
     }
  }

  validateTo(locale){
    if(locale.value.to == '' && locale.value.to != 0){
      this.toCheck = true;
     }else{
       this.toCheck = false;
     }
  }

  validateFrom(locale){
    if(locale.value.from == '' && locale.value.from != 0){
      this.fromCheck = true;
     }else{
       this.fromCheck = false;
     }
  }

  reset(){
    this.createDeliveryChargesFormGroup.controls['deliveryChargeListArray'].reset();
  }

  remove(i) {
    this.createdResult.splice(i, 1);
  }

  removeView(i){
    this.deliveryList['deliveryChargeList'].splice(i, 1);
  }
  
    getDeliveryCharges() {
      this.http.getJson(environment.APIEndpoint + 'api/rpa/deliveryCharge/v1/list')
        .subscribe((response) => {
          this.deliveryList = response;
          this.buildCreateDeliveryChargesForm(this.deliveryList);
          this.deliverychargesForm();
        })
    }


  
    createDeliveryCharges(){
      let formData = this.createDeliveryChargesFormGroup.value;
      if(formData.deliveryChargeAmount == undefined || formData.deliveryChargeAmount == ''){
        this.deliveryChargeAmountcheck = true;
       }else{
         this.deliveryChargeAmountcheck = false;
       }
  
       if(formData.to == undefined || formData.to == ''){
        this.toCheck = true;
       }else{
         this.toCheck = false;
       }
  
       if(formData.from == undefined || formData.from == ''){
        this.fromCheck = true;
       }else{
         this.fromCheck = false;
       }

      if(this.createdResult.length != 0 || (this.deliveryList['deliveryChargeList'].length != 0 || this.deliveryList['deliveryChargeList'] != null || this.deliveryList['deliveryChargeList'] != [])){
        this.fromCheck = false;
        this.toCheck = false;
        this.deliveryChargeAmountcheck = false;

        let allDeliveryCharges = this.createdResult.concat(this.deliveryList['deliveryChargeList']);
          this.loading = true;
              this.showError = false;
                let createTaxReq = {
                  deliveryChargeOid:formData.deliveryChargeOid,
                  orderAmount: formData.orderAmount,
                  status:"ONLINE",
                  deliveryChargeList: this.deliveryList['deliveryChargeList'] == null ? this.createdResult : allDeliveryCharges,
                }
                let CREATE_DELIVERY_CHARGES=environment.APIEndpoint+"api/rpa/deliveryCharge/v1/create";
                this.http.postJson(CREATE_DELIVERY_CHARGES,createTaxReq).subscribe((response) => {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "success",
                                    message: "Delivery charges added successfully"
                                }
                        });
                        this.loading = false;
                        this.router.navigate(['/delivery-charges']);
                        // window.location.reload();
                      }
                    ,err => {
                            this.loading = false;
                            if(err.error.errorType=='VALIDATION'){
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                        duration: 10000,
                                        data: {
                                            status: "failure",
                                            message: err.error.errorDetails[0].description
                                        }
                                    });
                            }else{
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                        duration: 10000,
                                        data: {
                                            status: "failure",
                                            message: "Your request cannot be saved at this time. Please try again later"
                                        }
                                    });
                            }
                    })

        }
       
 }
}