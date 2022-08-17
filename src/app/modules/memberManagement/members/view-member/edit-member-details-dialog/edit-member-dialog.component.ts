import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA ,MatSnackBar,MatTableDataSource} from '@angular/material';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';

@Component({
  selector: 'edit-member-dialog.component',
  templateUrl: './edit-member-dialog.component.html',
  styleUrls: ['./edit-member-dialog.component.scss']
})
export class EditMemberDialogComponent implements OnInit {

  public basicDetails;
  public tierList:any = [];
  customerProfileTierGroup:FormGroup;

  constructor(private dialogRef: MatDialogRef<MatDialog>,private https: HttpService,private fb: FormBuilder,private snackBar: MatSnackBar) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.buildEditForm();
    this.getAllTiers();
  }

  getAllTiers(){
    let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
    this.https.getJson(GET_ALL_TIERS)
    .subscribe((response) => {
        this.tierList = response; 
    });
  }

    onCloseClick(): void {
      this.dialogRef.close();
    }

    public buildEditForm(){
      let form={
        tierOid:["",Validators.required],
        tierExpiryDate:[""],
        expiryType:["forever",Validators.required]
      }

      this.customerProfileTierGroup=this.fb.group(form);
    }

    public changeValidation(){
      
      let expiryTypeField=this.customerProfileTierGroup.get('expiryType');
      
      if(null!=expiryTypeField && expiryTypeField.value!='forever'){
        this.customerProfileTierGroup.get('tierExpiryDate').setValidators([Validators.required]);
        this.customerProfileTierGroup.get('tierExpiryDate').updateValueAndValidity();
      }else{
        this.customerProfileTierGroup.get('tierExpiryDate').clearValidators();
        this.customerProfileTierGroup.get('tierExpiryDate').updateValueAndValidity();
      }
     }

    public updateCustomerTier (fromData){
      let body={
          customerOid:this.basicDetails.customerOid,
          tierOid:fromData.tierOid,
          tierExpiryDate:fromData.tierExpiryDate!='' ? moment(fromData.tierExpiryDate).format('YYYY-MM-DD'):''  
      }
  
      let UPDATE_TIER = environment.APIEndpoint+"api/rpa/memberMgmt/v1/updateTier";
      this.https.postJson(UPDATE_TIER,body)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "success",
                                message: "Customer Tier have been updated successfully"
                            }
                    });
                    this.dialogRef.close();
                }
                ,err => {
                        console.log("error Status = "+err);
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
                        this.dialogRef.close();
                });
      }
}
