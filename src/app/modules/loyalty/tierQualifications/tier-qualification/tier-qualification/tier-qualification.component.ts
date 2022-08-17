import { Component, OnInit, Input, HostListener } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormArray
} from "@angular/forms";
import { MatSnackBar, MatDialogRef } from "@angular/material";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import {
  MatDialog,
  MatDialogConfig
} from "@angular/material";
import { loyaltyTtiers } from '../loyalty-tiers/loyalty-tiers.component';
import { value } from 'src/app/feedback.global';


@Component({
  selector: 'tier-qualification',
  templateUrl: './tier-qualification.component.html',
  styleUrls: ['./tier-qualification.component.scss']
})

export class TierQualificationComponent implements OnInit {
  addTierGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  editStatus: boolean = false;
  editableCard: boolean = false;
  public showError = false;
  BttnDisabled: any;
  public tierData = [];
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public loading = false;
  public imageUploading = false;
  buildFlag = false;
  public currencyOids;
  checked = true;
  public rigionList = [];
  tierLevel;
  @Input() editable: boolean = false;
  tierList: any;
  @HostListener('blur', ['$event.target']) onBlur(target) {
    console.log(`onBlur(): ${new Date()} - ${JSON.stringify(target)}`);
  }
  public breadCrumbData: Array<Object> = [
    {
      title: "Loyalty",
      link: ""
    },
    {
      title: "Tier Qualification",
      link: "/search-programs"
    }
  ];
  lastTier: boolean = true;

  constructor(private http: HttpService, private uploadFile: UploadFile, public snackBar: MatSnackBar,
    private fb: FormBuilder, private dialog: MatDialog, ) {
    this.buildCreateTierForm();
    this.getBaseCurrency();
    this.getOnBoardingRegions();
  }

  getViewData() {
    this.http.getJson(environment.APIEndpoint + "api/rpa/tier/v1/qualification")
      .subscribe((response) => {
        console.log(response["tierRegionList"])
        this.tierData = response["tierRegionList"];
        const control = <FormArray>this.addTierGroup.controls['mainFormArray'];
        this.tierData.forEach((t, i) => {
          let newGroup = this.fb.group({
            regionId: [t.regionId],
            countryId: [t.countryId],
            activeEngagementDays: [t.tierEngagementDays],
            tierFormArray: this.fb.array([]),
          });
          control.push(newGroup);
          this.buildTierForm(control.controls[i], t);
        });
      })
  }

  ngOnInit() {
  }

  public buildTierForm(recievedControl, viewdata) {
    for (let j of viewdata.tierList) {
      j["editStatus"] = false;
      j["editableCard"] = false;
      j["imageErr"] = false;
      j["imageErrMsg"] = "";
      const control = <FormArray>recievedControl.controls['tierFormArray'];
      let newGroup = this.fb.group({
        minValue1: [j.minAmount],
        maxValue1: [j.maxAmount],
        tierId: [j.tierId],
        tierName: [j.tierName],
        name: [j.tierName, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])],
        minValue: [j.minAmount, Validators.compose([Validators.required, Validators.max(j.maxAmount)])],
        maxValue: [j.maxAmount, Validators.compose([Validators.required, Validators.min(parseInt(j.minAmount) + 1)])],
        tierLevel: [j.tierLevel],
      });
      control.push(newGroup);
    }
    this.buildFlag = true;
  }

  public buildCreateTierForm() {
    let mainform = {
      mainFormArray: this.fb.array([]),
    }
    this.addTierGroup = this.fb.group(mainform);
    this.getViewData();
  }

  public uploadTierImage(event: FileList, tier, j) {
    this.imageUploading = true;
    tier.tierImage = "";
    if (event[0].type == "image/svg" || event[0].type == "image/svg+xml" || event[0].type == "image/png") {
      if (event[0].size < 1000000) {
        tier.imageErr = false;
        tier.imageErrMsg = "";
        this.uploadFile.upload(event.item(0), 'tier', 'images')
          .subscribe((response) => {
            console.log(response)
            const mainControl = <FormArray>this.addTierGroup.controls['mainFormArray'];
            for (let a = 0; a < mainControl.length; a++) {
              this.tierData[a].tierList[j].tierImage = response['message'];
            }
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

  addTier() {
    this.BttnDisabled = this.tierData[0].tierList.length < 5;
    if (this.BttnDisabled) {
      for (let region of this.tierData) {
        let obj = {
          editStatus: true,
          editableCard: true,
          tierImage: "",
          imageErr: false,
          imageErrMsg: "",
          img: "assets/images/icons/upload_img_ico.png"
        }
        region.tierList[region.tierList.length] = obj;
      //  console.log(region.tierList);
       this.tierList = region.tierList;
      }

      const mainFormControl = <FormArray>this.addTierGroup.controls['mainFormArray'];
      this.tierData.forEach((t, i) => {
        console.log(i);
        console.log(t)
        console.log(mainFormControl.controls[i])
        this.createAddedTierForm(mainFormControl.controls[i],this.tierList,this.tierData);
      });
    }
  }

  public createAddedTierForm(recievedControl,tierList,tierData) {
    console.log(tierData);
    console.log(tierList);
    const control = <FormArray>recievedControl.controls['tierFormArray'];
    let newGroup = this.fb.group({
      tierId: [""],
      name: ["", Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')])],
      tierImage: [""],
      minValue: [parseInt(control["controls"][control.length - 1].value.maxValue) + 1],
      maxValue: ["", Validators.compose([Validators.min(parseInt(control["controls"][control.length - 1].value.maxValue) + 1)])],
      tierLevel: [""]
    });
    control.push(newGroup);
  }

  editTier(region, tier, regionIndex, tierIndex,tierList,tierData) {
    console.log(tierData);
    console.log(region);
    console.log(tierList);
    tier.editableCard = true;
    let regionArray = this.addTierGroup.get('mainFormArray') as FormArray;
    let tierArray = regionArray.at(regionIndex).get('tierFormArray') as FormArray;
    let tempTier = tierArray.at(tierIndex);
        let temp = tempTier.value
        let tierdisplayName = tempTier.get('tierName').value;
        console.log(tierdisplayName);
        console.log(temp);
    let tempTierData = {
      minAmount: temp.minValue1,
      maxAmount: temp.maxValue1,
      tierId: temp.tierId,
      tierName: tierdisplayName,
    }
    console.log(tempTierData);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      tempdata : tempTierData,
      tierdata: tier,
      fullTierDetailsData: region,
      regionIndex: regionIndex,
      tierIndex: tierIndex,
      tierList: tierList
    }
       dialogConfig.autoFocus = false;
    let dialogRef = this.dialog.open(loyaltyTtiers, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    
      tier.editableCard = false;
      let regionArray = this.addTierGroup.get('mainFormArray') as FormArray;
      let tierArray = regionArray.at(regionIndex).get('tierFormArray') as FormArray;
      let tempTier = tierArray.at(tierIndex);
      tempTier.get('tierName').patchValue(result.tierData.tierName);
      tempTier.get('tierName').updateValueAndValidity();
      tempTier.get('minValue').patchValue(result.tierData.minAmount);
      tempTier.get('minValue').updateValueAndValidity();
      tempTier.get('maxValue').patchValue(result.tierData.maxAmount);
      tempTier.get('maxValue').updateValueAndValidity();
      tempTier.get('minValue1').setValue(result.tierData.minAmount);
      tempTier.get('minValue1').updateValueAndValidity();
      tempTier.get('maxValue1').setValue(result.tierData.maxAmount);
      tempTier.get('maxValue1').updateValueAndValidity();
      this.checkMinAndMax(tempTier.get('maxValue1').value, tempTier.get('minValue1').value, regionIndex, tierIndex);
     this.autoPopulateName(tempTier.get('tierName').value, regionIndex, tierIndex,tierList,tierData);
      if (regionIndex == 0) {
      this.autoPopulateCurrencyValueMax(tempTier.get('maxValue1').value, regionIndex, tierIndex,tierList,tierData);
      this.autoPopulateCurrencyValueMin(tempTier.get('minValue1').value, regionIndex, tierIndex,tierList,tierData);
      }
    });
     }

  getOnBoardingRegions() {
    let GET_ALL_REGIONS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
    this.http.getJson(GET_ALL_REGIONS)
      .subscribe((response) => {
        this.currencyOids = response["regionList"].map(oid => oid.currencyOid);
        console.log(this.currencyOids);
        this.rigionList = response['regionList'];
        console.log(this.rigionList);
        this.getCurrencyConversionValue(this.currencyOids);
      })
  }

  public basecurrency = '';
  getBaseCurrency() {
    let GET_BASE_CURRENCY = environment.APIEndpoint + "api/rpa/master/currency/v1/getbasecurrency";
    this.http.getJson(GET_BASE_CURRENCY)
      .subscribe((response) => {
        this.basecurrency = response["currencyCode"];
      })
  }

  public conversionList: any = [];

  public getCurrencyConversionValue(currencyOids: any) {
    let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint +
      "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
      currencyOids;
    this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
      .subscribe((response) => {
        console.log(response);
        this.conversionList = response;
      })
  }

  autoPopulateName(value, regionIndex, tierIndex,tierList,tierData) {
    for(let i = 0; i < tierData.length; i++){
    for (let l = 0; l < tierData[i].tierList.length; l++) {
         let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
         let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
         if(tierIndex == l){
            tierArray.at(l).patchValue({
              tierName: value
            });
            tierArray.markAsPristine;
            console.log(value);
          }
    }
    }
  }

  public autoPopulateCurrencyValueMax(currencyValue, regionIndex, tierIndex,tierList,tierData) {
    if (regionIndex == 0 && currencyValue != null && currencyValue != '') {
       for(let i = 0; i < tierData.length; i++){
        for(let j = 0; j < tierData[i].tierList.length; j++){
      let regionArray = this.addTierGroup.get('mainFormArray') as FormArray;
      let tierArray = regionArray.at(regionIndex).get('tierFormArray') as FormArray;
      let tempMaxValue: any;
      let tempMinValue: any;
            if(tierIndex == j){
              for(let k= 0; k < tierList.length; k++){
                for(let l = 0; l < tierData[i].tierList.length; l++){
        for (let conversion of this.conversionList) {
         let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
         let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
          if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
            let conversionValue = conversion.conversionValue * parseInt(currencyValue);
            console.log(conversionValue);
            tierArray.at(j).patchValue({
              maxValue1: [conversionValue.toFixed(3)] 
            });
            tierArray.markAsPristine;
          }
        }
      }
        }
      }
       if (j == tierArray.length - 1) {
        for (let m = tierIndex; m >= 0; m--) {
          console.log(tierIndex);
          if (m - 1 >= 0) {
            tempMaxValue = tierArray.at(m-1).get('maxValue1').value;
           for(let k= 0; k < tierList.length; k++){
            for(let l = 0; l < tierData[i].tierList.length; l++){
            for (let conversion of this.conversionList) {
              let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
              let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
              console.log("tempMaxValue" +tempMaxValue);
                  if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                    let conversionValue = conversion.conversionValue * parseInt(tempMaxValue);
                    console.log(conversionValue);
                    tierArray.at(m-1).patchValue({
                      maxValue1: [conversionValue.toFixed(3)] 
                    });
                    tierArray.markAsPristine;
                  }
                }
            }
            }
          }
        }
      }
      else if (tierIndex == 0) {
        for (let m = tierIndex; m <= tierArray.length; m++) {
          if (m + 1 <= tierArray.length - 1) {
            tempMaxValue = tierArray.at(m + 1).get('maxValue1').value;
            for(let k= 0; k < tierList.length; k++){
              for(let l = 0; l < tierData[i].tierList.length; l++){
              for (let conversion of this.conversionList) {
                let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                console.log("tempMaxValue" +tempMaxValue);
                    if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                      let conversionValue = conversion.conversionValue * parseInt(tempMaxValue);
                      console.log(conversionValue);
                      tierArray.at(m + 1).patchValue({
                        maxValue1: [conversionValue.toFixed(3)] 
                      });
                      tierArray.markAsPristine;
                    }
                  }
              }
              }
      }
       
          }
          for (let m = tierIndex; m <= tierArray.length; m++) {
            if (m + 1 <= tierArray.length - 1) {
              tempMinValue = tierArray.at(m + 1).get('minValue1').value;
              for(let k= 0; k < tierList.length; k++){
                for(let l = 0; l < tierData[i].tierList.length; l++){
                for (let conversion of this.conversionList) {
                  let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                  let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                  console.log("tempMinValue" +tempMinValue);
                      if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                        let conversionValue = conversion.conversionValue * parseInt(tempMinValue);
                        console.log(conversionValue);
                        tierArray.at(m+1).patchValue({
                          minValue1: [conversionValue.toFixed(3)] 
                        });
                        tierArray.markAsPristine;
                      }
                    }
                }
                }
        }
         
            }
        }
        else {
          if (tierIndex >= 0) {
            for (let m = tierIndex; m >= 0; m--) {
              if (m - 1 >= 0) {
                tempMaxValue = tierArray.at(m - 1).get('maxValue1').value;
                console.log("tempMaxValue" +tempMaxValue);
                for(let k= 0; k < tierList.length; k++){
                  for(let l = 0; l < tierData[i].tierList.length; l++){
                  for (let conversion of this.conversionList) {
                    let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                    let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                        if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                          let conversionValue = conversion.conversionValue * parseInt(tempMaxValue);
                          console.log(conversionValue);
                          tierArray.at(m-1).patchValue({
                            maxValue1: [conversionValue.toFixed(3)] 
                          });
                          tierArray.markAsPristine;
                        }
                      }
                  }
                  }
              }
            }
            for (let m = tierIndex; m <= tierArray.length; m++) {
              if (m + 1 <= tierArray.length -1) {
                tempMaxValue = tierArray.at(m + 1).get('maxValue1').value;
                for(let k= 0; k < tierList.length; k++){
                  for(let l = 0; l < tierData[i].tierList.length; l++){
                  for (let conversion of this.conversionList) {
                    let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                    let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                    console.log("tempMaxValue" +tempMaxValue);
                        if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                          let conversionValue = conversion.conversionValue * parseInt(tempMaxValue);
                          console.log(conversionValue);
                          tierArray.at(m + 1).patchValue({
                            maxValue1: [conversionValue.toFixed(3)] 
                          });
                          tierArray.markAsPristine;
                        }
                      }
                  }
                  }
              }
            }
          }
        }
      }
      }
    }
    } 

    public autoPopulateCurrencyValueMin(currencyValue, regionIndex, tierIndex,tierList,tierData) {
    if (regionIndex == 0 && currencyValue != null && currencyValue != '') {
       for(let i = 0; i < tierData.length; i++){
        for(let j = 0; j < tierData[i].tierList.length; j++){
      let regionArray = this.addTierGroup.get('mainFormArray') as FormArray;
      let tierArray = regionArray.at(regionIndex).get('tierFormArray') as FormArray;
      let tempMinValue: any;
            if(tierIndex == j){
              for(let k= 0; k < tierList.length; k++){
                for(let l = 0; l < tierData[i].tierList.length; l++){
        for (let conversion of this.conversionList) {
         let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
         let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
          if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
            let conversionValue = conversion.conversionValue * parseInt(currencyValue);
            console.log(conversionValue);
            tierArray.at(j).patchValue({
              minValue1: [conversionValue.toFixed(3)] 
            });
            tierArray.markAsPristine;
          }
        }
      }
        }
      }
       if (j == tierArray.length - 1) {
        for (let m = tierIndex; m >= 0; m--) {
          console.log(tierIndex);
          if (m - 1 >= 0) {
            tempMinValue = tierArray.at(m-1).get('minValue1').value;
           for(let k= 0; k < tierList.length; k++){
            for(let l = 0; l < tierData[i].tierList.length; l++){
            for (let conversion of this.conversionList) {
              let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
              let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
              console.log("tempMinValue" +tempMinValue);
                  if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                    let conversionValue = conversion.conversionValue * parseInt(tempMinValue);
                    console.log(conversionValue);
                    tierArray.at(m-1).patchValue({
                      minValue1: [conversionValue.toFixed(3)] 
                    });
                    tierArray.markAsPristine;
                  }
                }
            }
            }
          }
        }
      }
      else if (tierIndex == 0) {
        for (let m = tierIndex; m <= tierArray.length; m++) {
          if (m + 1 <= tierArray.length - 1) {
            tempMinValue = tierArray.at(m + 1).get('minValue1').value;
            for(let k= 0; k < tierList.length; k++){
              for(let l = 0; l < tierData[i].tierList.length; l++){
              for (let conversion of this.conversionList) {
                let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                console.log("tempMinValue" +tempMinValue);
                    if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                      let conversionValue = conversion.conversionValue * parseInt(tempMinValue);
                      console.log(conversionValue);
                      tierArray.at(m+1).patchValue({
                        minValue1: [conversionValue.toFixed(3)] 
                      });
                      tierArray.markAsPristine;
                    }
                  }
              }
              }
      }
       
          }
        }
        else {
          if (tierIndex >= 0) {
            for (let m = tierIndex; m >= 0; m--) {
              if (m - 1 >= 0) {
                tempMinValue = tierArray.at(m - 1).get('minValue1').value;
                console.log("tempMinValue" +tempMinValue);
                for(let k= 0; k < tierList.length; k++){
                  for(let l = 0; l < tierData[i].tierList.length; l++){
                  for (let conversion of this.conversionList) {
                    let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                    let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                        if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                          let conversionValue = conversion.conversionValue * parseInt(tempMinValue);
                          console.log(conversionValue);
                          tierArray.at(m-1).patchValue({
                            minValue1: [conversionValue.toFixed(3)] 
                          });
                          tierArray.markAsPristine;
                        }
                      }
                  }
                  }
              }
            }
            for (let m = tierIndex; m <= tierArray.length; m++) {
              if (m + 1 <= tierArray.length -1) {
                tempMinValue = tierArray.at(m + 1).get('minValue1').value;
                for(let k= 0; k < tierList.length; k++){
                  for(let l = 0; l < tierData[i].tierList.length; l++){
                  for (let conversion of this.conversionList) {
                    let regionArray= this.addTierGroup.get('mainFormArray') as FormArray;
                    let tierArray= regionArray.at(i).get('tierFormArray') as FormArray;
                    console.log("tempMinValue" +tempMinValue);
                        if (conversion.currencyCode === this.tierData[i].currencyCode && i !== 0) {
                          let conversionValue = conversion.conversionValue * parseInt(tempMinValue);
                          console.log(conversionValue);
                          tierArray.at(m+1).patchValue({
                            minValue1: [conversionValue.toFixed(3)] 
                          });
                          tierArray.markAsPristine;
                        }
                      }
                  }
                  }
               
              }
            }
          }
        }
      }
      }
    }
    }
 

  public checkMinAndMax(maxValue1: any, minValue1: any, regionIndex, tierIndex) {
    let tempRegion = this.addTierGroup.get('mainFormArray') as FormArray;
    let tempTier = tempRegion.at(regionIndex).get('tierFormArray') as FormArray;
    let tempMinValue: any;
    let tempMaxValue: any;
    if (tempTier.length == tierIndex + 1) {
      for (let i = tierIndex; i >= 0; i--) {
        if (i - 1 >= 0) {
          tempMinValue = tempTier.at(i - 1).get('minValue1').value;
          tempMaxValue = tempTier.at(i - 1).get('maxValue1').value;
          if (tempMaxValue >= tempTier.at(i).get('minValue1').value) {
            tempMaxValue = tempTier.at(i).get('minValue1').value - 1;
            tempTier.at(i - 1).get('maxValue1').setValue(tempMaxValue);
            tempTier.at(i - 1).get('maxValue1').updateValueAndValidity();
            tempTier.at(i - 1).get('maxValue').setValue(tempMaxValue);
            tempTier.at(i - 1).get('maxValue').updateValueAndValidity();
          }
          if (tempMinValue >= tempMaxValue) {
            tempMinValue = tempMaxValue - 1;
            tempTier.at(i - 1).get('minValue1').setValue(tempMinValue);
            tempTier.at(i - 1).get('minValue1').updateValueAndValidity();
            tempTier.at(i - 1).get('minValue').setValue(tempMinValue);
            tempTier.at(i - 1).get('minValue').updateValueAndValidity();
          }
        }
      }
    } else if (tierIndex == 0) {
      for (let i = tierIndex; i <= tempTier.length; i++) {
        if (i + 1 <= tempTier.length - 1) {
          tempMinValue = tempTier.at(i + 1).get('minValue1').value;
          tempMaxValue = tempTier.at(i + 1).get('maxValue1').value;
          if (tempMinValue <= tempTier.at(i).get('maxValue1').value) {
            tempMinValue = tempTier.at(i).get('maxValue1').value + 1;
            tempTier.at(i + 1).get('minValue1').setValue(tempMinValue);
            tempTier.at(i + 1).get('minValue1').updateValueAndValidity();
            tempTier.at(i + 1).get('minValue').setValue(tempMinValue);
            tempTier.at(i + 1).get('minValue').updateValueAndValidity();
          }
          if (tempMaxValue <= tempMinValue) {
            tempMaxValue = tempMinValue + 1;
            tempTier.at(i + 1).get('maxValue1').setValue(tempMaxValue);
            tempTier.at(i + 1).get('maxValue1').updateValueAndValidity();
            tempTier.at(i + 1).get('maxValue').setValue(tempMaxValue);
            tempTier.at(i + 1).get('maxValue').updateValueAndValidity();
          }
        }
      }
    } else {
      if (tierIndex >= 0) {
        for (let i = tierIndex; i >= 0; i--) {
          if (i - 1 >= 0) {
            tempMinValue = tempTier.at(i - 1).get('minValue1').value;
            tempMaxValue = tempTier.at(i - 1).get('maxValue1').value;
            if (tempMaxValue >= tempTier.at(i).get('minValue1').value) {
              tempMaxValue = tempTier.at(i).get('minValue1').value - 1;
              tempTier.at(i - 1).get('maxValue1').setValue(tempMaxValue);
              tempTier.at(i - 1).get('maxValue1').updateValueAndValidity();
              tempTier.at(i - 1).get('maxValue').setValue(tempMaxValue);
              tempTier.at(i - 1).get('maxValue').updateValueAndValidity();
            }
            if (tempMinValue >= tempMaxValue) {
              tempMinValue = tempMaxValue - 1;
              tempTier.at(i - 1).get('minValue1').setValue(tempMinValue);
              tempTier.at(i - 1).get('minValue1').updateValueAndValidity();
              tempTier.at(i - 1).get('minValue').setValue(tempMinValue);
              tempTier.at(i - 1).get('minValue').updateValueAndValidity();
            }
          }
        }
        for (let i = tierIndex; i <= tempTier.length; i++) {
          if (i + 1 <= tempTier.length -1) {
            tempMinValue = tempTier.at(i + 1).get('minValue1').value;
            tempMaxValue = tempTier.at(i + 1).get('maxValue1').value;
            if (tempMinValue <= tempTier.at(i).get('maxValue1').value) {
              tempMinValue = tempTier.at(i).get('maxValue1').value + 1;
              tempTier.at(i + 1).get('minValue1').setValue(tempMinValue);
              tempTier.at(i + 1).get('minValue1').updateValueAndValidity();
              tempTier.at(i + 1).get('minValue').setValue(tempMinValue);
              tempTier.at(i + 1).get('minValue').updateValueAndValidity();
            }
            if (tempMaxValue <= tempMinValue) {
              tempMaxValue = tempMinValue + 1;
              tempTier.at(i + 1).get('maxValue1').setValue(tempMaxValue);
              tempTier.at(i + 1).get('maxValue1').updateValueAndValidity();
              tempTier.at(i + 1).get('maxValue').setValue(tempMaxValue);
              tempTier.at(i + 1).get('maxValue').updateValueAndValidity();
            }
          }
        }
      }
    }
  }

  prePopulateMin(value, k, j) {
    const mainControl = <FormArray>this.addTierGroup.controls['mainFormArray'];
    const item = mainControl.controls[k]["controls"]["tierFormArray"];
    if (j < 4 && value != '' && item["controls"][j + 1] != undefined) {
      item["controls"][j + 1].patchValue({
        minValue: parseInt(value) + 1
      });
      this.tierData[k].tierList[j + 1].minAmount = parseInt(value) + 1;
    }
    item["controls"][j].controls['minValue'].setValidators(
      Validators.compose([Validators.required, Validators.max(value)]));
    item["controls"][j].controls['minValue'].updateValueAndValidity();

    

    console.log(item["controls"].length);
    console.log(item["controls"][j].value);
    console.log(item["controls"][j].value.maxValue)
    let lastTier = item["controls"].length-1;
    console.log(lastTier);
    console.log(item["controls"].length-1);
    if (!lastTier) {
      item["controls"][j].controls['maxValue'].setValidators(
        Validators.compose([Validators.required, Validators.min(parseInt(item["controls"][j].value.minValue) + 1)]));
      item["controls"][j].controls['maxValue'].updateValueAndValidity();
    } else {
      let linkto =  item["controls"][j].controls['maxValue'];
      linkto.clearValidators();
      linkto.updateValueAndValidity();
      let linkto1 =  item["controls"][j].controls['maxValue1'];
      linkto1.clearValidators();
      linkto1.updateValueAndValidity();
    }
  }

  prePopulateName(value, k, j) {
    const mainControl = <FormArray>this.addTierGroup.controls['mainFormArray'];
    for (let a = 0; a < mainControl.length; a++) {
      if (k != a) {
        mainControl.controls[a]["controls"]["tierFormArray"]["controls"][j].patchValue({
          name: value,
        });
        this.tierData[a].tierList[j].tierName = value;
        console.log(value);
      }
    }
  }

  validateMin(value, k, j) {
    const mainControl = <FormArray>this.addTierGroup.controls['mainFormArray'];
    const item = mainControl.controls[k]["controls"]["tierFormArray"];
    if (j == 0 && value != '' && this.tierData[k].tierList[j].minAmount != value) {
      for (let a = 0; a < item["controls"].length; a++) {
        if (item["controls"][a + 1] != undefined) {
          item["controls"][a + 1].patchValue({
            minValue: "",
            maxValue: ""
          });
          this.tierData[k].tierList[a + 1].minAmount = '';
          this.tierData[k].tierList[a + 1].maxAmount = '';
        }
      }
    }
    item["controls"][j].controls['minValue'].setValidators(
      Validators.compose([Validators.required, Validators.max(item["controls"][j].value.maxValue)]));
    item["controls"][j].controls['minValue'].updateValueAndValidity();

   
    
    console.log(item["controls"].length);
    console.log(item["controls"][j].value);
    console.log(item["controls"][j].value.maxValue)
    let lastTier = item["controls"].length-1;
    console.log(lastTier);
    console.log(item["controls"].length-1);
    if (!lastTier) {
       item["controls"][j].controls['maxValue'].setValidators(
      Validators.compose([Validators.required, Validators.min(value + 1)]));
    item["controls"][j].controls['maxValue'].updateValueAndValidity();
    } else {
      let linkto =  item["controls"][j].controls['maxValue'];
      linkto.clearValidators();
      linkto.updateValueAndValidity();
      let linkto1 =  item["controls"][j].controls['maxValue'];
      linkto1.clearValidators();
      linkto1.updateValueAndValidity();
    }
  }

  reload(){
    window.location.reload();
  }

  updateOrSaveTier(formData) {
    console.log(formData);
    console.log(formData.mainFormArray);
    console.log(this.addTierGroup.invalid);
    // if (this.addTierGroup.invalid == true) {
    //   this.showError = true;
    // }
    // else {
      this.loading = true;
      this.showError = false;
      let tierRegions = [];
      for (var i = 0; i < formData.mainFormArray.length; i++) {
        let obj = {
          regionId: formData.mainFormArray[i].regionId,
          countryId: formData.mainFormArray[i].countryId,
          tierEngegementDays: formData.mainFormArray[i].activeEngagementDays,
          tierList: this.getTierDetails(formData.mainFormArray[i].tierFormArray, i),
        }
        tierRegions.push(obj);
      }
      let reqObj = {
        tierRegions: tierRegions
      }

      this.http.postJson(environment.APIEndpoint + "api/rpa/tier/v1/qualification", reqObj)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Tier details has been updated successfully"
            }
          });
          this.loading = false;
         window.location.reload();
        }
          , err => {
            this.loading = false;
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
          })
    }
 // }

  public getTierDetails(tierFormArray, mainIndex) {
    let tierDetails = [];
    console.log(tierFormArray.length);
    console.log(tierFormArray);
    for (var i = 0; i < tierFormArray.length; i++) {
      let obj = {
        tierId: tierFormArray[i].tierId,
        tierName: tierFormArray[i].name,
        tierImage: this.tierData[mainIndex].tierList[i].tierImage,
        minAmount: parseFloat(tierFormArray[i].minValue1 == undefined ? tierFormArray[i].minValue : tierFormArray[i].minValue1),
        maxAmount: parseFloat(tierFormArray[i].maxValue1 == undefined ? tierFormArray[i].maxValue : tierFormArray[i].maxValue1),
      }
      tierDetails.push(obj);
      console.log(obj);
    }
    return tierDetails;
  }
}