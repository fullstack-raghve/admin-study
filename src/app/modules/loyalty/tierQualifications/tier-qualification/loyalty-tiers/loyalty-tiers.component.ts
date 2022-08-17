import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA, MatSnackBar, MatDialogRef
} from "@angular/material";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';


@Component({
  selector: 'loyalty-tiers.component',
  templateUrl: 'loyalty-tiers.component.html',
  styleUrls: ['loyalty-tiers.component.scss']
})

export class loyaltyTtiers implements OnInit {
  public loyalty_tiers_data;
  public edit_loyalty_tiers_form: FormGroup;
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public imageUploading = false;
  minValue_new;
  maxValue_new;
  public regionIndex;
  public tierIndex;
  public fullTierDetail;
  public uploadTierImg;
  public showError = false;
  public lastTierValidate:boolean;
  tierLevel: any;
  tierList: any;
  tierDetails: any[];
  tierFormArray: any;
  lastTierId: any;
  editableTierId: any;
  lastTier: any;
  tierName_new: any;
  tierName: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public snackBar: MatSnackBar,
    private uploadFile: UploadFile, private dialogRef: MatDialogRef<loyaltyTtiers>, private http: HttpService) { }

  ngOnInit() {
    this.buidloyaltyTierEditForm();
    this.loyalty_tiers_data = this.data.tierdata;
    console.log(this.loyalty_tiers_data);
    this.editableTierId = this.loyalty_tiers_data.tierId;
    console.log(this.editableTierId);
    this.fullTierDetail = this.data.fullTierDetailsData;
    this.tierList = this.data.tierList;
    console.log(this.tierList);
    console.log(this.tierList.length);
    let lastTier = this.tierList[this.tierList.length-1];
    lastTier = this.lastTier;
    console.log(lastTier);
    console.log(this.lastTierId);
    if (this.tierList[this.tierList.length-1]) {
      let linkto = this.edit_loyalty_tiers_form.get('maxValue');
      linkto.clearValidators();
      linkto.updateValueAndValidity();
    } else {
      let linkTo = this.edit_loyalty_tiers_form.get('maxValue');
      linkTo.setValidators([Validators.required]);
      linkTo.updateValueAndValidity();
    }
    this.patchLoyaltyFormValue(this.data.tempdata);
    console.log(this.data.tempdata);
    this.minValue_new = this.data.tempdata.minAmount;
    this.maxValue_new = this.data.tempdata.maxAmount;
    this.tierName_new = this.data.tempdata.tierName;
    console.log(this.tierName_new);

    this.edit_loyalty_tiers_form.get('maxValue').valueChanges.subscribe(
      (data: any) => {
        console.log(data);
        if (data) {
          this.maxValue_new = parseInt(data);
        }
      }
    );

    this.edit_loyalty_tiers_form.get('minValue').valueChanges.subscribe(
      (data: any) => {
        if (data) {
          this.minValue_new = parseInt(data);
        }
      }
    );
  }

  public buidloyaltyTierEditForm() {
    this.edit_loyalty_tiers_form = this.fb.group({
      tierId: [''],
      name: [null, Validators.compose([Validators.required])],
      minValue: [null, Validators.compose([Validators.required, Validators.max(this.maxValue_new)])],
      maxValue: [null, Validators.compose([Validators.required, Validators.min(parseInt(this.minValue_new + 1))])]
    })
  }

  patchLoyaltyFormValue(formValue) {
    console.log(formValue);
    this.edit_loyalty_tiers_form.patchValue({
      tierId: formValue.tierId,
      name: formValue.tierName,
      minValue: formValue.minAmount,
      maxValue: formValue.maxAmount
    })
  }

  public uploadTierImage(event: FileList, tier) {
    this.imageUploading = true;
    tier.tierImage = "";
    if (event[0].type == "image/svg" || event[0].type == "image/svg+xml" || event[0].type == "image/png") {
      if (event[0].size < 1000000) {
        tier.imageErr = false;
        tier.imageErrMsg = "";
        this.uploadFile.upload(event.item(0), 'tier', 'images')
          .subscribe((response) => {
            this.uploadTierImg = response['message'];
            console.log(this.uploadTierImg)
            this.data.tierdata.tierImage = response['message'];
            tier.tierImage = response['message'];
            this.imageUploading = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          })
      } else {
        tier.imageErr = true;
        tier.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      tier.imageErr = true;
      tier.imageErrMsg = "Can upload only SVG and PNG image/icon";
    }
  }

  removeImage() {
    this.data.tierdata.tierImage = ''
  }

  updateTier(val) {
    this.dialogRef.close({
      'buttonName': 'UPDATE',
      'tierData': this.getTierDetails()
    });
  }

  public getTierDetails() {
    let tierDetails;
    let obj = {
      tierId: this.edit_loyalty_tiers_form.get('tierId').value,
      tierName: (this.edit_loyalty_tiers_form.get('name').value),
      tierImage: (this.data.tierdata.tierImage),
      minAmount: parseFloat(this.edit_loyalty_tiers_form.get('minValue').value),
      maxAmount: parseFloat(this.edit_loyalty_tiers_form.get('maxValue').value),
    }
    tierDetails = obj;
    console.log(obj);
    return tierDetails;
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}