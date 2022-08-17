import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogConfig, MatDialog, MatSnackBar, } from "@angular/material";
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { AddSearchGiftCardCardStatusDialogComponent } from '../add-search-gift-card-card-status-dialog/add-search-gift-card-card-status-dialog.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Globals } from '../../../../../../../src/app/services/global';
import { MatStepperModule } from '@angular/material/stepper';
@Component({
  selector: 'app-add-search-gift-cards',
  templateUrl: './add-search-gift-cards.component.html',
  styleUrls: ['./add-search-gift-cards.component.scss']
})
export class AddSearchGiftCardsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  selectedCardValue=[]
  card_status:any=[];
  checkGIFTED:boolean=false;
  checkBLOCKED:boolean=false;
  checkEXPIRED:boolean=false;
  checkASSIGNED:boolean=false;
  checkGENERATED:boolean=false;
  checkPRINTING:boolean=false;
  checkAVAILABLE:boolean=false;
  checkMISSING:boolean=false;
  checkDAMAGED:boolean=false;
  checkACTIVE:boolean=false;
  checkSOLD:boolean=false;
  quantytyCheckErr: boolean = false;
  rangeError: boolean = false;
  public imageUploading: boolean = false;
  @ViewChild('stepper') stepper;
  public selectedIndex = 0;
  filePathName: string;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  cardDetails = []
  finalData = []
  secondFormData = {}
  statusAndCount = []
  cardsDetail: any = []
  public selectedStorearray = [];
  assign = []
  public imagePath: string = '';
  public showImageError: boolean = false;
  cardDetailArray: any = []
  gifted = []
  expired = []
  available = []
  generated = []
  blocked = []
  printing = []
  missing = [];
  demaged = [];
  active = [];
  sold = [];
  disableStatus:boolean=false;
  thirdFormdata;
  public commError: boolean = false;
  public range: boolean = false;
  nameDetail: any;
  uploadedFile
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  GiftArray: any;
  BlockedArray: any;
  public storeRequiredFiled = false;
  AssgnArray: any;
  PrintingArray: any;
  AvailableArray: any;
  DamagedArray: any;
  MissingArray: any;
  SoldArray: any;
  ActiveArray: any;
  ExpiredArray: any;
  GeneratedArray: any;
  public selectStoreVal = false;
  public dataStore: boolean = false;
  public storeErrorMsg;
  giftCardCode: any=[];
  arrayLength: any;
  arrayValue;
  giftArrayLength;
  giftLength = 0;
  blockCardCode: any = [];
  blockLength = 0;
  expiredLength = 0
  expiredCardCod: any = []
  assignedLength = 0
  assignedCardCod: any = []
  generatedLength = 0
  generatedCardCod: any = []
  printingLength = 0
  printingCardCod: any = []
  availableLength = 0
  availableCardCod: any = []
  missingLength = 0
  missingCardCod: any = []
  damagedLength = 0
  damagedCardCod: any = []
  activeLength = 0
  activeCardCod: any = []
  soldLength = 0
  soldCardCod: any = []
  giftcardCodeIdArray = []
  PrintArray: any;
  AvailabArray: any;
  MissinArray: any;
  DamageArray: any;
  ActivArray: any;
  SolArray: any;
  selectedStorearrayLength;
  lengthValue: any = [];
  startingCardID: any;
  assignKey: any;
  availableKey: any;
  card_statusKey: string;
 
  constructor(private router: Router, private _formBuilder: FormBuilder, private uploadFile: UploadFile, public snackBar: MatSnackBar, private https: HttpService, public dialog: MatDialog, private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.buildFirstForm();
    this.buildThirdFormGroup();
    this.getCardType();
  }

  changeStep(index: number) {
    this.stepper.selectedIndex = index;
  }

  buildFirstForm() {
    this.firstFormGroup = this.fb.group({
      cardType: ['', Validators.compose([Validators.required])],
      rangeUpload: [''],
      startRange: [''],
      rangeQuantity: [''],


    });
    console.log(this.firstFormGroup);

    this.buildSecondFormGroup();
  }
  buildSecondFormGroup() {
    this.secondFormGroup = this.fb.group({
      commentConditionArray: this.fb.array([]),
    });
    this.commentFormArray()

  }

  buildThirdFormGroup() {
    this.thirdFormGroup = this.fb.group({

      quan: ['', Validators.compose([Validators.required,])],
      EcarId: ['', Validators.compose([Validators.required,])],
      ScarId: ['', Validators.compose([Validators.required,])],
      // GIFTED
      Giftedkey: [''],
      GiftedkeyComment: [''],
      Assignekey: [''],
      AssignedkeyComment: [''],
      // PRINTING
      Printingkey: [''],
      PrintingkeyComment: [''],
      // GENERATED
      Generatedkey: [''],
      GeneratedkeyComment: [''],
      // AVAILABLE
      Availablekey: [''],
      AvailablekeyComment: [''],
      // MISSING
      Missingkey: [''],
      MissingkeyComment: [''],
      // ACTIVE
      Activekey: [''],
      ActivekeyComment: [''],
      // SOLD
      Soldkey: [''],
      SoldkeyComment: [''],
    });
    this.patchToThirdForm()
    console.log(this.thirdFormGroup);

  }
  // to patch value in third form
  patchToThirdForm() {
    let cValue
    let quantity
    let endtingCardID
    let count
    let changeStatus
    let changeComment
    let formData = this.secondFormGroup.value
    // console.log(formData);
    formData['commentConditionArray']
    this.finalData = formData['commentConditionArray']
    // console.log(this.finalData);
    this.cardDetailArray = []
    for (let i = 0; i < this.finalData.length; i++) {
      cValue = this.finalData[i]['CardValue']
      count = this.finalData[i]['count']
      changeStatus = this.finalData[i]['name']
      changeComment = this.finalData[i]['comment']
      
      // GIFTED
      if (this.finalData[i]['CardValue'] == 'GIFTED') {
        this.thirdFormGroup.controls['Giftedkey'].patchValue(this.giftLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['GiftedkeyComment'].patchValue(changeComment);
      }
      //  ASSIGNED
      else if (this.finalData[i]['CardValue'] == 'ASSIGNED') {
        this.thirdFormGroup.controls['Assignekey'].patchValue(this.assignedLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['AssignedkeyComment'].patchValue(changeComment);
      }
      // PRINTING
      else if (this.finalData[i]['CardValue'] == 'PRINTING') {
        this.thirdFormGroup.controls['Printingkey'].patchValue(this.printingLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus)
        this.thirdFormGroup.controls['PrintingkeyComment'].patchValue(changeComment)
      }
      // GENERATED
      else if (this.finalData[i]['CardValue'] == 'GENERATED') {
        this.thirdFormGroup.controls['Generatedkey'].patchValue(this.generatedLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['GeneratedkeyComment'].patchValue(changeComment);
      }
      // AVAILABLE
      else if (this.finalData[i]['CardValue'] == 'AVAILABLE') {
        this.thirdFormGroup.controls['Availablekey'].patchValue(this.availableLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['AvailablekeyComment'].patchValue(changeComment);
      }
      // MISSING
      else if (this.finalData[i]['CardValue'] == 'MISSING') {
        this.thirdFormGroup.controls['Missingkey'].patchValue(this.missingLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['MissingkeyComment'].patchValue(changeComment);
      }
      // ACTIVE
      else if (this.finalData[i]['CardValue'] == 'ACTIVE') {

        this.thirdFormGroup.controls['Activekey'].patchValue(this.activeLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['ActivekeyComment'].patchValue(changeComment);
      }
      // SOLD
      else if (this.finalData[i]['CardValue'] == 'SOLD') {
        this.thirdFormGroup.controls['Soldkey'].patchValue(this.soldLength + " " + '' + 'Card of status:' + " " + cValue + " " + 'moved to' + " " + changeStatus);
        this.thirdFormGroup.controls['SoldkeyComment'].patchValue(changeComment);
      }
    }

    this.startingCardID = this.cardsDetail['startingCardID']
    quantity = this.cardsDetail['quantity']
    endtingCardID = this.cardsDetail['endtingCardID']

    this.thirdFormGroup.controls['ScarId'].patchValue(this.startingCardID);
    this.thirdFormGroup.controls['quan'].patchValue(quantity);
    this.thirdFormGroup.controls['EcarId'].patchValue(endtingCardID);


  }


  public stValue;
  public newstValue;
  //public options2;

  public commentFormArray() {
    const control = <FormArray>this.secondFormGroup.controls['commentConditionArray'];

    for (let i = 0; i < this.statusAndCount.length; i++) {

      this.stValue = this.statusAndCount[i]['newStat'];
      for (let j = 0; j < this.statusAndCount[i]['newStat'].length; j++) {
        this.newstValue = this.statusAndCount[i]['newStat'][j];
      }
      let keyval = this.statusAndCount[i]['name'] + '-' + this.statusAndCount[i]['count']
      let newForm = this.fb.group({
        cardStatus: keyval,
        CardValue: this.statusAndCount[i]['name'],
        // quantity2:['3'],
        count: [this.statusAndCount[i]['count']],
        comment: [''],
        newStatus: [this.statusAndCount[i]['newStat']],
        name: [''],
        lengthgiftcaerCodeId: this.selectedStorearrayLength

      });
      //this.options2=[{"id":"123","name":"Test"}]
      // console.log(newForm);

      control.push(newForm);
    }
  }

  getCardType() {
    let data = {

    }
    this.https.postJson1('https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type', data).subscribe(res => {
      // console.log(res['Output']);
      // console.log(JSON.stringify(res['Output']));
      this.cardDetails = res['Output']

    })
  }

  goFromFirstForm(value) {
    if (this.firstFormGroup.get('rangeUpload').value == "") {
      this.rangeError = true;
    }
    else {
      this.rangeError = false;
    }
    this.buildSecondFormGroup();
    let formData = this.firstFormGroup.value

    console.log(this.firstFormGroup.get('cardType').status);

    if (this.firstFormGroup.get('cardType').value == '') {
      this.firstFormGroup.get('cardType').setValidators([Validators.required]);
      this.firstFormGroup.get('cardType').updateValueAndValidity();
    }
    else {


      // if (this.firstFormGroup.value.rangeUpload = "Range") 
      if (this.firstFormGroup.get('rangeUpload').value == "Range") {
        this.secondFormGroup.reset();
        this.thirdFormGroup.reset();
        if (this.firstFormGroup.invalid) {
          return false;
        }
        else {
          let data = {
            "cardTypeId": formData.cardType,
            "startRange": formData.startRange.trim(),
            "quantity": formData.rangeQuantity
          }
          this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/bulk_movement', data).subscribe(res => {
            // console.log(res['Output']);
            this.secondFormData = res['Output']
            this.stepper.next();
            console.log(JSON.stringify(res['Output']));
            let selected_quantity_total_count = JSON.stringify(res['Output']['statusAndCount']);
            console.log(selected_quantity_total_count);
            
            this.statusAndCount = res['Output']['statusAndCount'];
            for(let i = 0;i< this.statusAndCount.length;i++){
              if((this.statusAndCount[i]['name'] != 'ASSIGNED' || this.statusAndCount[i]['name'] != 'GIFTED' || this.statusAndCount[i]['name'] != 'AVAILABLE' || this.statusAndCount[i]['name'] != 'GENERATED' || this.statusAndCount[i]['name'] != 'PRINTING' || this.statusAndCount[i]['name'] != 'MISSING' || this.statusAndCount[i]['name'] != 'ACTIVE' || this.statusAndCount[i]['name'] != 'SOLD') && ((this.statusAndCount[i]['name'] == 'EXPIRED') || (this.statusAndCount[i]['name'] == 'BLOCKED') || (this.statusAndCount[i]['name'] == 'DAMAGED'))){
                this.disableStatus = true;
              }else{
                this.disableStatus = false;
              }
            }
            console.log('Boolean Value-->',this.disableStatus);
            for (let i = 0; i < this.statusAndCount.length; i++) {
              let Name = this.statusAndCount[i]['name'];
              if (Name == 'GIFTED') {
                this.GiftArray = this.statusAndCount[i]['newStat'];
                this.giftLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'BLOCKED') {
                this.BlockedArray = this.statusAndCount[i]['newStat'];
                this.blockLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'ASSIGNED') {
                this.AssgnArray = this.statusAndCount[i]['newStat'];
                this.assignedLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'EXPIRED') {
                this.ExpiredArray = this.statusAndCount[i]['newStat'];
                this.expiredLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'GENERATED') {
                this.GeneratedArray = this.statusAndCount[i]['newStat']
                this.generatedLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'PRINTING') {
                this.PrintArray = this.statusAndCount[i]['newStat'];
                this.printingLength = this.statusAndCount[i]['count'];
                console.log(this.printingLength);

              }
              else if (Name == 'AVAILABLE') {
                this.AvailabArray = this.statusAndCount[i]['newStat'];
                this.availableLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'MISSING') {
                this.MissinArray = this.statusAndCount[i]['newStat'];
                this.missingLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'DAMAGED') {
                this.DamageArray = this.statusAndCount[i]['newStat'];
                this.damagedLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'ACTIVE') {
                this.ActivArray = this.statusAndCount[i]['newStat'];
                this.activeLength = this.statusAndCount[i]['count'];
              }
              else if (Name == 'SOLD') {
                this.SolArray = this.statusAndCount[i]['newStat'];
                this.soldLength = this.statusAndCount[i]['count'];
              }


              this.nameDetail = this.statusAndCount[i]
              // console.log(this.nameDetail);

            }
            try {
              this.cardsDetail = res['Output']['cardsDetail']
            } catch{ }
            try {
              this.assign = this.secondFormData = res['Output']['ASSIGNED']
            } catch{ }
            try {
              this.expired = this.secondFormData = res['Output']['EXPIRED']
            } catch{ }
            try {
              this.gifted = this.secondFormData = res['Output']['GIFTED']
            } catch{ }
            try {
              this.available = this.secondFormData = res['Output']['AVAILABLE']
            } catch{ }

            try {
              this.generated = this.secondFormData = res['Output']['GENERATED']
            } catch{ }
            try {
              this.blocked = this.secondFormData = res['Output']['BLOCKED']
            } catch{ }
            try {
              this.printing = this.secondFormData = res['Output']['PRINTING']
            } catch{ }
            try {
              this.missing = this.secondFormData = res['Output']['MISSING']
            } catch{ }
            try {
              this.demaged = this.secondFormData = res['Output']['DAMAGED']
            } catch{ }
            try {
              this.active = this.secondFormData = res['Output']['ACTIVE']
            } catch{ }
            try {
              this.sold = this.secondFormData = res['Output']['SOLD']
            } catch{ }
            this.buildSecondFormGroup();
            this.buildThirdFormGroup();
            // this.snackBar.openFromComponent(SnackBarComponent, {
            //   duration: 1500,
            //   data: {
            //     status: "success",
            //     message: ""
            //   }
            // });
          },
            err => {
              // console.log(err)
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 3000,
                data: {
                  status: "failure",
                  message: err.error.Error_message
                }
              });


            }

          );


        }

      }
      if (this.firstFormGroup.get('rangeUpload').value == "Upload") {
        this.secondFormGroup.reset();
        this.thirdFormGroup.reset();

        this.firstFormGroup.get('rangeQuantity').clearValidators();
        this.firstFormGroup.get('rangeQuantity').updateValueAndValidity();
        this.firstFormGroup.get('rangeQuantity').reset();

        this.firstFormGroup.get('startRange').clearValidators();
        this.firstFormGroup.get('startRange').updateValueAndValidity();
        this.firstFormGroup.get('startRange').reset();

        if (this.uploadedFile != undefined && this.uploadedFile != null) {

          // uploading file while clicking update botton directly
          if (this.uploadedFile.size < 3000000) {
            if (this.uploadedFile.type == "application/vnd.ms-excel" || this.uploadedFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {


              this.uploadFile.Search_gift_card_upload(this.uploadedFile, this.uploadedFile.type, formData.cardType)
                .subscribe(res => {

                  // console.log(res['Output']);
                  this.secondFormData = res['Output']
                  this.stepper.next();
                  // console.log(JSON.stringify(res['Output']));

                  // console.log(this.secondFormData);
                  this.statusAndCount = res['Output']['statusAndCount'];

                  for(let i = 0;i< this.statusAndCount.length;i++){
                    if((this.statusAndCount[i]['name'] != 'ASSIGNED' || this.statusAndCount[i]['name'] != 'GIFTED' || this.statusAndCount[i]['name'] != 'AVAILABLE' || this.statusAndCount[i]['name'] != 'GENERATED' || this.statusAndCount[i]['name'] != 'PRINTING' || this.statusAndCount[i]['name'] != 'MISSING' || this.statusAndCount[i]['name'] != 'ACTIVE' || this.statusAndCount[i]['name'] != 'SOLD') && ((this.statusAndCount[i]['name'] == 'EXPIRED') || (this.statusAndCount[i]['name'] == 'BLOCKED') || (this.statusAndCount[i]['name'] == 'DAMAGED'))){
                      this.disableStatus = true;
                    }else{
                      this.disableStatus = false;
                    }
                  }
                  for (let i = 0; i < this.statusAndCount.length; i++) {
                    let Name = this.statusAndCount[i]['name'];
                    if (Name == 'GIFTED') {
                      this.GiftArray = this.statusAndCount[i]['newStat'];
                      this.giftLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'BLOCKED') {
                      this.BlockedArray = this.statusAndCount[i]['newStat'];
                      this.blockLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'ASSIGNED') {
                      this.AssgnArray = this.statusAndCount[i]['newStat'];
                      this.assignedLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'EXPIRED') {
                      this.ExpiredArray = this.statusAndCount[i]['newStat'];
                      this.expiredLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'GENERATED') {
                      this.GeneratedArray = this.statusAndCount[i]['newStat'];
                      this.generatedLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'PRINTING') {
                      this.PrintArray = this.statusAndCount[i]['newStat'];
                      this.printingLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'AVAILABLE') {
                      this.AvailabArray = this.statusAndCount[i]['newStat'];
                      this.availableLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'MISSING') {
                      this.MissinArray = this.statusAndCount[i]['newStat'];
                      this.missingLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'DAMAGED') {
                      this.DamageArray = this.statusAndCount[i]['newStat'];
                      this.damagedLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'ACTIVE') {
                      this.ActivArray = this.statusAndCount[i]['newStat'];
                      this.activeLength = this.statusAndCount[i]['count'];
                    }
                    else if (Name == 'SOLD') {
                      this.SolArray = this.statusAndCount[i]['newStat'];
                      this.soldLength = this.statusAndCount[i]['count'];
                    }


                    this.nameDetail = this.statusAndCount[i]
                    // console.log(this.nameDetail);

                  }
                  try {
                    this.cardsDetail = res['Output']['cardsDetail']
                  } catch{ }
                  try {
                    this.assign = this.secondFormData = res['Output']['ASSIGNED']
                  } catch{ }
                  try {
                    this.expired = this.secondFormData = res['Output']['EXPIRED']
                  } catch{ }
                  try {
                    this.gifted = this.secondFormData = res['Output']['GIFTED']
                  } catch{ }
                  try {
                    this.available = this.secondFormData = res['Output']['AVAILABLE']
                  } catch{ }

                  try {
                    this.generated = this.secondFormData = res['Output']['GENERATED']
                  } catch{ }
                  try {
                    this.blocked = this.secondFormData = res['Output']['BLOCKED']
                  } catch{ }
                  try {
                    this.printing = this.secondFormData = res['Output']['PRINTING']
                  } catch{ }
                  try {
                    this.missing = this.secondFormData = res['Output']['MISSING']
                  } catch{ }
                  try {
                    this.demaged = this.secondFormData = res['Output']['DAMAGED']
                  } catch{ }
                  try {
                    this.active = this.secondFormData = res['Output']['ACTIVE']
                  } catch{ }
                  try {
                    this.sold = this.secondFormData = res['Output']['SOLD']
                  } catch{ }
                  this.buildSecondFormGroup();
                  this.buildThirdFormGroup();

                },
                  err => {
                    // console.log(err)
                    this.snackBar.openFromComponent(SnackBarComponent, {
                      duration: 3000,
                      data: {
                        status: "failure",
                        message: err.error.Error_message
                      }
                    });


                  }


                );

            }

          }

        }



      }
    }
  }
  goFromSecondForm(stepper: MatStepper) {
    this.thirdFormGroup.reset();
    let formData = this.secondFormGroup.value
    // console.log('formData--->',formData);
    formData['commentConditionArray']
    this.thirdFormdata = formData['commentConditionArray']
    // console.log(this.thirdFormdata);
    for (let i = 0; i < this.thirdFormdata.length; i++) {
      this.lengthValue.push(this.thirdFormdata[i]['lengthgiftcaerCodeId'])
      // console.log(this.lengthValue);

    }
    stepper.next();






  }

  public selectedStore = [];

  // for the Selected quantity popup
  cardStatus(value) {
    // console.log(value);
    let str = new String(value);
    let splits = str.split("-");
    this.arrayValue = splits[0];
    // console.log(this.arrayValue);
    // let card_status;
    if (this.arrayValue == 'ASSIGNED') {
      this.card_status = this.assign;
      this.card_statusKey = 'ASSIGNED'
    }
    else if (this.arrayValue == 'AVAILABLE') {
      this.card_status = this.available;
      this.card_statusKey = 'AVAILABLE'

    }

    else if (this.arrayValue == 'EXPIRED') {
      this.card_status = this.expired;
      this.card_statusKey = 'EXPIRED'
    }
    else if (this.arrayValue == 'GIFTED') {
      this.card_status = this.gifted;
      this.card_statusKey = 'GIFTED'
    }
    else if (this.arrayValue == 'GENERATED') {
      this.card_status = this.generated;
      this.card_statusKey = 'GENERATED'
    }
    else if (this.arrayValue == 'BLOCKED') {
      this.card_status = this.blocked;
      this.card_statusKey = 'BLOCKED'
    }

    else if (this.arrayValue == 'PRINTING') {
      this.card_status = this.printing;
      this.card_statusKey = 'PRINTING'
    }
    else if (this.arrayValue == 'MISSING') {
      this.card_status = this.missing;
      this.card_statusKey = 'MISSING'
    }
    else if (this.arrayValue == 'DAMAGED') {
      this.card_status = this.demaged;
      this.card_statusKey = 'DAMAGED'
    }
    else if (this.arrayValue == 'ACTIVE') {
      this.card_status = this.active;
      this.card_statusKey = 'ACTIVE'
    }
    else if (this.arrayValue == 'SOLD') {
      this.card_status = this.sold;
      this.card_statusKey = 'SOLD'
    }
    console.log(this.card_status);

    const dialogRef = this.dialog.open(AddSearchGiftCardCardStatusDialogComponent);
    dialogRef.componentInstance.cardStatusArray = this.card_status;
    dialogRef.componentInstance.selectedData = this.selectedCardValue;
    console.log(this.selectedCardValue);       
    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.card_status=[];
       
        this.selectedCardValue=result.tableData;
        console.log(result);
        console.log(this.card_statusKey);
        if (this.card_statusKey == 'GIFTED' && result.tableData.length == 0) {
          this.giftLength = 0;
          this.checkGIFTED=true;
        } else if (this.card_statusKey == 'BLOCKED' && result.tableData.length == 0) {
          this.blockLength = 0;
          this.checkBLOCKED=true;
        } else if (this.card_statusKey == 'EXPIRED' && result.tableData.length == 0) {
          this.expiredLength = 0;
          this.checkEXPIRED=true;
        } else if (this.card_statusKey == 'ASSIGNED' && result.tableData.length == 0) {
          this.assignedLength = 0;
          this.checkASSIGNED=true;
        } else if (this.card_statusKey == 'GENERATED' && result.tableData.length == 0) {
          this.generatedLength = 0;
          this.checkGENERATED=true;
        } else if (this.card_statusKey == 'PRINTING' && result.tableData.length == 0) {
          this.printingLength = 0;
          this.checkPRINTING=true;
        } else if (this.card_statusKey == 'AVAILABLE' && result.tableData.length == 0) {
          this.availableLength = 0;
          this.checkAVAILABLE=true;
        } else if (this.card_statusKey == 'MISSING' && result.tableData.length == 0) {
          this.missingLength = 0;
          this.checkMISSING=true;
        } else if (this.card_statusKey == 'DAMAGED' && result.tableData.length == 0) {
          this.damagedLength = 0;
          this.checkDAMAGED=true;
        } else if (this.card_statusKey == 'ACTIVE' && result.tableData.length == 0) {
          this.activeLength = 0;
          this.checkACTIVE=true;
        } else if (this.card_statusKey == 'SOLD' && result.tableData.length == 0) {
          this.soldLength = 0;
          this.checkSOLD=true;
        }
       

        for (let i = 0; i < result.tableData.length; i++) {
          if (result.tableData[i].status == 'GIFTED') {
            this.giftLength = result.tableData.length
            this.giftCardCode.push(result.tableData[i]['giftcardCodeId']);
            
          }

          if (result.tableData[i].status == 'BLOCKED') {
            this.blockLength = result.tableData.length
            this.blockCardCode.push(result.tableData[i]['giftcardCodeId'])
          }

          if (result.tableData[i].status == 'EXPIRED') {
            this.expiredLength = result.tableData.length
            this.expiredCardCod.push(result.tableData[i]['giftcardCodeId']);
          }

          if (result.tableData[i].status == 'ASSIGNED') {
            this.assignedLength = result.tableData.length
            this.assignedCardCod.push(result.tableData[i]['giftcardCodeId']);
          } else if (this.card_statusKey == 'ASSIGNED' && result.tableData.length == 0) {
            this.assignedLength = 0;
          }

          if (result.tableData[i].status == 'GENERATED') {
            this.generatedLength = result.tableData.length
            this.generatedCardCod.push(result.tableData[i]['giftcardCodeId']);
            console.log(this.generatedCardCod);

          }

          if (result.tableData[i].status == 'PRINTING') {
            this.printingLength = result.tableData.length
            this.printingCardCod.push(result.tableData[i]['giftcardCodeId']);
          }

          if (result.tableData[i].status == 'AVAILABLE') {
            this.availableLength = result.tableData.length
            this.availableCardCod.push(result.tableData[i]['giftcardCodeId']);  
            this.card_status=this.availableCardCod  
          }

          if (result.tableData[i].status == 'MISSING') {
            this.missingLength = result.tableData.length
            this.missingCardCod.push(result.tableData[i]['giftcardCodeId']);

          }

          if (result.tableData[i].status == 'DAMAGED') {
            this.damagedLength = result.tableData.length
            this.damagedCardCod.push(result.tableData[i]['giftcardCodeId']);
          }

          if (result.tableData[i].status == 'ACTIVE') {
            this.activeLength = result.tableData.length
            this.activeCardCod.push(result.tableData[i]['giftcardCodeId']);
          }

          if (result.tableData[i].status == 'SOLD') {
            this.soldLength = result.tableData.length
            this.soldCardCod.push(result.tableData[i]['giftcardCodeId']);
          }
          console.log('gf--->',this.giftCardCode);

          const arrrayTemp = this.selectedStorearray;
          this.selectedCardValue=result.tableData;
          console.log(this.selectedCardValue);
          
          this.selectedStorearray = Array.from(new Set(arrrayTemp));
          if (this.selectedStorearray.length) {
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
        console.log('KeyValues-->', this.printingCardCod)
        if (this.selectedStorearray.length != 0) {
          this.storeRequiredFiled = false;
          this.storeErrorMsg = "Please select Store";
        }
      }
    });
    console.log(this.card_status);
  }
  checkType(val) {
    this.secondFormGroup.reset();
    if (val == 'Range') {
      this.range = true;
      this.firstFormGroup.get('startRange').reset();
      this.firstFormGroup.get('rangeQuantity').reset();
    }
    if (val == 'Upload') {
      this.range = false;
      this.firstFormGroup.get('startRange').clearValidators();
      this.firstFormGroup.get('startRange').updateValueAndValidity();
      this.firstFormGroup.get('startRange').reset();
      this.firstFormGroup.get('rangeQuantity').clearValidators();
      this.firstFormGroup.get('rangeQuantity').updateValueAndValidity();
      this.firstFormGroup.get('rangeQuantity').reset();

    }
  }


  selectChangeHandler(event: any, selectedval) {
    //update the ui
    let selectedDay = selectedval;
    return false;

  }


  public uploadImage(event: FileList) {
    this.filePathName = '';
    if (event[0].size < 1000000) {

      if (event[0].type == "text/csv" || event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadedFile = event[0]
        console.log(this.uploadedFile);
        this.filePathName = this.uploadedFile['name']
        console.log(this.filePathName);

      }
      else {

        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Please check the file formate"
          }
        });
      }
    }
    else {

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }

  }

  finalSubmition() {
    let formData = this.secondFormGroup.value
    console.log(formData);
    formData['commentConditionArray']
    this.finalData = formData['commentConditionArray']
    console.log(JSON.stringify(this.finalData));
    this.cardDetailArray = []
    for (let i = 0; i < this.finalData.length; i++) {
      if (this.finalData[i]['CardValue'] == 'AVAILABLE') {
        let keyCode = []
        
        if (this.availableCardCod.length == 0 && this.checkAVAILABLE==false) 
        {
          for (let j = 0; j < this.available.length; j++) {
            keyCode.push(this.available[j]['giftcardCodeId']);
          }

        } else {
          for (let i = 0; i < this.availableCardCod.length; i++) {
            keyCode.push(this.availableCardCod[i]);
          }
        }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }

// generated

      else if (this.finalData[i]['CardValue'] == 'GENERATED') {
        let keyCode = []
        if (this.generatedCardCod.length == 0 && this.checkGENERATED==false) {
          for (let j = 0; j < this.generated.length; j++) {
            keyCode.push(this.generated[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.generatedCardCod.length; i++) {
          keyCode.push(this.generatedCardCod[i]);
        }
      }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }
     }

    //  printed
      else if (this.finalData[i]['CardValue'] == 'PRINTING') {
        let keyCode = []
        if (this.printingCardCod.length == 0 && this.checkPRINTING==false) {
          for (let j = 0; j < this.printing.length; j++) {
            keyCode.push(this.printing[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.printingCardCod.length; i++) {
          keyCode.push(this.printingCardCod[i]);
        }
        }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }
}
// gifted
      else if (this.finalData[i]['CardValue'] == 'GIFTED') {
        let keyCode = []
        console.log('gf--->',this.giftCardCode.length);
        if (this.giftCardCode.length == 0 && this.checkGIFTED==false) {
          for (let j = 0; j < this.gifted.length; j++) {
            keyCode.push(this.gifted[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.giftCardCode.length; i++) {
          keyCode.push(this.giftCardCode[i]);
        }
      }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// missing
      else if (this.finalData[i]['CardValue'] == 'MISSING') {
        let keyCode = []
        if (this.missingCardCod.length == 0 && this.checkMISSING==false) {
          for (let j = 0; j < this.missing.length; j++) {
            keyCode.push(this.missing[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.missingCardCod.length; i++) {
          keyCode.push(this.missingCardCod[i]);
        }
      }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// assign
      else if (this.finalData[i]['CardValue'] == 'ASSIGNED') {
        let keyCode = []
        if (this.assignedCardCod.length == 0 && this.checkASSIGNED==false) {
          for (let j = 0; j < this.assign.length; j++) {
            keyCode.push(this.assign[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.assignedCardCod.length; i++) {
          keyCode.push(this.assignedCardCod[i]);
        }}
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// expire
      else if (this.finalData[i]['CardValue'] == 'EXPIRED') {
        let keyCode = []
        if (this.expiredCardCod.length == 0 && this.checkEXPIRED==false) {
          for (let j = 0; j < this.expired.length; j++) {
            keyCode.push(this.expired[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.expiredCardCod.length; i++) {
          keyCode.push(this.expiredCardCod[i]);
        }
      }
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// block
      else if (this.finalData[i]['CardValue'] == 'BLOCKED') {
        let keyCode = []
        if (this.blockCardCode.length == 0 && this.checkBLOCKED==false) {
          for (let j = 0; j < this.blocked.length; j++) {
            keyCode.push(this.blocked[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.blockCardCode.length; i++) {
          keyCode.push(this.blockCardCode[i]);
        }}
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// demage
      else if (this.finalData[i]['CardValue'] == 'DAMAGED') {
        let keyCode = []
        if (this.damagedCardCod.length == 0 && this.checkDAMAGED==false) {
          for (let j = 0; j < this.demaged.length; j++) {
            keyCode.push(this.demaged[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.damagedCardCod.length; i++) {
          keyCode.push(this.damagedCardCod[i]);
        }}
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// active
      else if (this.finalData[i]['CardValue'] == 'ACTIVE') {
        let keyCode = []
        if (this.activeCardCod.length == 0 && this.checkACTIVE==false) {
          for (let j = 0; j < this.active.length; j++) {
            keyCode.push(this.active[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.activeCardCod.length; i++) {
          keyCode.push(this.activeCardCod[i]);
        }}
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
// sold
      else if (this.finalData[i]['CardValue'] == 'SOLD') {
        let keyCode = []
        if (this.soldCardCod.length == 0 && this.checkSOLD==false) {
          for (let j = 0; j < this.sold.length; j++) {
            keyCode.push(this.sold[j]['giftcardCodeId']);
          }
        }
        else{
        for (let i = 0; i < this.soldCardCod.length; i++) {
          keyCode.push(this.soldCardCod[i]);
        }}
        let keyObj = {
          "giftcardCodeId": keyCode,
          "newStatus": this.finalData[i]['name'],
          "comment": this.finalData[i]['comment']
        }
        if (keyObj.newStatus != '') {
          this.cardDetailArray.push(keyObj)
        }

      }
    }
    let formDatathird = this.thirdFormGroup.value
    console.log(formDatathird);

    let data = {
      "cardsDetail": this.cardDetailArray,
    }
    console.log(JSON.stringify(data));
    this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/bulk_update', data).subscribe(res => {
      console.log(res['Output']);
      this.router.navigate(["/search-search-gift-cards"]);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "success",
          message: "Updated successfully"
        }
      });
    },
      err => {
        console.log(err)
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 3000,
          data: {
            status: "failure",
            message: 'Your request cannot be saved at this time. Please try again later'
          }
        });


      });
  }

}
