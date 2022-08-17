import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar, MatDialog } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { productsDialog } from 'src/app/shared/components/products-dialog/products-dialog.component';

export function checkValidation(group: FormGroup) {

    let perceptual = group.get('perceptual').value;
    let endDateControl = group.get('endDate');
    let pointExpiryIn = group.get('pointExpiryIn').value;
    let expiryDate = group.get('expiryDate');
    let numberOfDays = group.get('numberOfDays');
    //   let programType:any = group.get('programType');
    //   let rewardType:any =group.get('rewardType');
    //   let overallAccural = group.get('overallAccurals');
    //   let overAllLimit = group.get('overAllLimit');
    //   let dailyLimit =group.get('dailyLimit');

    if (perceptual == false) {
        endDateControl.setValidators([Validators.required]);
    } else {
        endDateControl.clearValidators();
        endDateControl.updateValueAndValidity();
    }
    if (pointExpiryIn == 'FIXEDDATE') {
        numberOfDays.markAsPristine;
        numberOfDays.setValue('');
        numberOfDays.clearValidators();
        expiryDate.setValidators([Validators.required]);
        numberOfDays.updateValueAndValidity();
        expiryDate.updateValueAndValidity();
    } if (pointExpiryIn == 'NOOFDAYS') {
        expiryDate.markAsPristine;
        expiryDate.setValue('');
        expiryDate.clearValidators();
        numberOfDays.setValidators([Validators.required]);
        expiryDate.updateValueAndValidity();
        numberOfDays.updateValueAndValidity();
    }

    // if(programType.value!="BASE" && rewardType.value!="STAMPS"){
    //     overallAccural.setValidators([Validators.required]);
    //     overallAccural.updateValueAndValidity();
    //     overAllLimit.setValidators([Validators.required]);
    //     overAllLimit.updateValueAndValidity();
    //     dailyLimit.setValidators([Validators.required])
    //     dailyLimit.updateValueAndValidity();
    // }

}

export interface UserData {
    ruleName: string;
    actionType: string;
    action: string;
    startDate: string;
    endDate: string;
}
@Component({
    selector: 'edit-programs',
    templateUrl: './edit-programs.component.html',
    styleUrls: ['./edit-programs.component.scss']
})
export class EditProgramsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Programs',
        link: '/search-programs'
    }
    ];
    @ViewChild("createProgramForm") createProgramForm;
    @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
    @ViewChild('editSkuFile') editSkuFile: ElementRef;
    public freeproductvalues = [];
    public pointbrandIdValue;
    programFormGroup: FormGroup;
    selectedProgramType = 'Base';
    public programId:any;
    public programData = [];
    public brandList = [];
    public earnRuleList = [];
    public descriptionError = false;
    public burnRuleList = [];
    public imgUpload = false;
    public regionError = false;
    public disabled = false;
    public rewardTypeArr;
    public imageUploading: boolean = false;
    public imagePath: string = '';
    public showImageError: boolean = false;
    public limitPerCustFlag = false;
    public dailyLimitFlag = false;
    public uploadSkuFlag = false;
    public validateSkuFile = false;
    public minDate = new Date();
    public toggleVal;
    public loading = false;
    showError = false;
    public rewardErrMsg = false;
    public buildFlag = false;
    public skuFile = '';
    public conversionList = [];
    public imgPathUrl = localStorage.getItem("imgBaseUrl");
    public filePathUrl = localStorage.getItem("fileBaseUrl");
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public selectedCount = 0;
    public selectedProduct = [];
    public productErrorMsg;
    programLocales;
    public currenctDate;
    public minEndDates;
    rewardArr;
    public statusValue;
    public regionCurrencies;
    public endDateError = null;
    panelOpenState;
    public minExpiryDate: Date;
    alignCss = [];
    displayedColumns: string[] = ['ruleName', 'actionType', 'action', 'startDate', 'endDate'];
    burnDisplayedColumns: string[] = ['ruleName', 'rewardType', 'rewardQty', 'startDate', 'endDate'];
    earnDataSource: MatTableDataSource<UserData>;
    burnDataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    freeProductCodeValue: any;
   
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, private uploadFile: UploadFile,
        public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
        public dialog: MatDialog, ) {
            this.currenctDate = new Date();
            this.minEndDates = new Date();
        // this.activatedRoute.params.subscribe((params) => {
        //     this.programId = params.id;

        // });
        
        


        // this.dataSource = new MatTableDataSource(storeList);
    }

    baseUrl: any = '';
    ngOnInit() {
        this.programId = localStorage.getItem('EditID');
        this.getProgramDetails();
        if(this.programId){
            this.getAllBrands();
            this.viewEarnRuleList();
            this.ViewBurnRuleById();
            localStorage.removeItem('EditID');
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-programs']);
        }
       
        // this.getCurrencyConversionValue();

        //this.earnDataSource.paginator = this.paginator;
        //this.earnDataSource.sort = this.sort;

    }
    baseProgramImg(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUpload = true;
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.baseUrl = <string>reader.result;

            }
        }
    }
    url: any = '';
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUpload = true;
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]);

            reader.onload = (event) => {
                this.url = <string>reader.result;

            }
        }
    }

    setEndDate(formData) {
        let startDate = moment(formData.startDate);
        if (formData.endDate != null && formData.endDate != '') {
            let endDate = moment(formData.endDate);
            if (moment(endDate) < moment(startDate)) {
                this.endDateError = true;
            } else {
                this.endDateError = false;
            }
        }
        this.minEndDates = formData.startDate;
    }

    public buildEditProgramForm(editData) {

        let editStartTime = new Date();
        if (editData.startTime != null) {
            let s = editData.startTime.split(":");
            editStartTime.setHours(s[0]);
            editStartTime.setMinutes(s[1]);
        }
        let editEndTime = new Date();
        if (editData.endTime != null) {
            let e = editData.endTime.split(":");
            editEndTime.setHours(e[0]);
            editEndTime.setMinutes(e[1]);
        }
        if (editData.brand!=null){

            this.pointbrandIdValue = editData.brand.brandId;
        }
        this.freeProductCodeValue = editData.freeProductType;

        this.buildFlag = true;
        this.programFormGroup = this.fb.group({
            programType: [{ value: editData.programType, disabled: true }],
            brand: [editData.brand != null ? { value: editData.brand.brandId, disabled: true } : ''],

            freeProductValue: [editData.freeProductType != null ? { value: editData.freeProductType, disabled: true } : ''],


            // freeProductValue: [editData.freeProductType != null ? editData.freeProductType : ''],
            productBrand: { value: 'BASE', disabled: true },
            rewardType: [editData.rewardType, Validators.required],
            startDate: [new Date(editData.startDate), Validators.required],
            endDate: [editData.endDate != null ? new Date(editData.endDate) : '', Validators.required],
            startTime: [editData.startTime != null ? editStartTime : ''],
            endTime: [editData.endTime != null ? editEndTime : ''],
            pointExpiryIn: [editData.pointExpiryIn != null ? editData.pointExpiryIn : ''],
            perceptual: [editData.isPerpetual],
            expiryDate: [editData.expiryDate != null ? new Date(editData.expiryDate) : ''],
            numberOfDays: editData.expiryDays == null ? '' : editData.expiryDays,
            isEndOfMonth: [editData.isEndOfMonth],
            isAllowExtension: [editData.isAllowExtension],
            avatar: [editData.skuFilePath],
            programName: ["", Validators.required],
            descriptionCtrl: ["", Validators.required]
        });
        checkValidation(this.programFormGroup);
        this.patchValueToNameAndDesc(editData.programLocales);
        this.getBrandValue(this.pointbrandIdValue);
        this.getfreeproductvalue(this.freeProductCodeValue);
        if(editData.isPerpetual){
            this.disabled = true;
        }
    }
    public tierArrayForm(tierList) {
        // //this.tierFlag=true;
        // const control = <FormArray>this.programFormGroup.controls['tierArray'];
        // for(let t=0;t<tierList.length;t++){

        //     //let tier = this.tierList[t];
        //     let arr= this.fb.group({
        //         tierId: [tierList[t].tierId],
        //         currencyArr: this.fb.array([])
        //     });
        //     control.push(arr);
        //     this.tierCurrencyForm(control.controls[t], tierList[t].rewardValues);

        //     console.log("control"+control);
        // }


    }
    getAllBrands() {

        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
        this.http.getJson(GET_ALL_ONLINE_BRANDS)
            .subscribe((response) => {
                console.log(response);
                this.brandList = response;

            })



    }

    public tierCurrencyForm(control, rewardValues) {

        for (let r of rewardValues) {

            const array = <FormArray>control.controls['currencyArr'];
            let arr = this.fb.group({
                [r.regionId]: r.rewardValue
            });
            array.push(arr);
        }


    }

    // public programFormArray(programLocales){
    //     for(let p of programLocales){
    //         const control = <FormArray>this.programFormGroup.controls['programLocales'];
    //         let newForm = this.fb.group({
    //             programName: [p.programName, Validators.required],
    //         });
    //         control.push(newForm);
    //         //this.alignCss.push(p.direction == 'RTL' ? 'text-right' : '');

    //     }
    // }
    // public descriptionFormArray(programLocales){
    //     for(let p of programLocales){
    //         const control = <FormArray>this.programFormGroup.controls['descriptionArray'];
    //         let newForm = this.fb.group({
    //             description: [p.programDescription],
    //         });
    //         control.push(newForm);
    //     }


    // }

    public patchValueToNameAndDesc(locales: any) {
        let programName = this.programFormGroup.get('programName');
        let decription = this.programFormGroup.get('descriptionCtrl');
        programName.patchValue(locales[0].programName);
        decription.patchValue(locales[0].programDescription);
    }
    // ngAfterViewInit(){
    //     //this.editSkuFile.nativeElement.value = this.programData['skuFilePath'];
    //     this.programFormGroup.get('avatar').setValue(this.programData['skuFilePath']);
    // }
    createTemplate(formData) {

    }

    getRewardType(programType) {
        if (programType == 'BRAND') {
            this.rewardTypeArr = [
                { name: 'Base Reward', value: "BASEREWARD" },
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ];
        } else if (programType == 'PRODUCT') {
            this.rewardTypeArr = [
                { name: 'Base Reward', value: "BASEREWARD" },
                { name: 'Brand Reward', value: "BRANDREWARD" },
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ]

        } else {
            this.rewardTypeArr = [
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ];
        }
    }
    endDateAction(perceptual) {
        let endDateControl = this.programFormGroup.get('endDate');
        //let endTimeControl = this.programFormGroup.get('endTime');
        let pointExpiryType = this.programFormGroup.get("pointExpiryIn");
        if (perceptual == true) {
            endDateControl.setValue("");
            //endTimeControl.setValue("");
            this.disabled = true;
            endDateControl.clearValidators();
            endDateControl.updateValueAndValidity();
            pointExpiryType.setValue("");
            pointExpiryType.updateValueAndValidity();
        } else {
            this.disabled = false;
            endDateControl.setValidators([Validators.required]);
            endDateControl.updateValueAndValidity();
        }
    }

    setExpiryDate(endDate: Date) {
        let expiryDate = this.programFormGroup.get("expiryDate");
        this.minExpiryDate = new Date(moment(endDate).format());
        expiryDate.setValue('');
        expiryDate.updateValueAndValidity();
    }

    getProgramDetails() {
        let body = {
            programId: this.programId
        }
        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.http.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    this.brandList = [];

                    // for(let program of response["programLocales"]){
                    //  this.alignCss.push(program.direction == 'RTL' ? 'text-right' : '');
                    // }

                    if (response["pointExpiryIn"] == "FIXEDDATE") {
                        this.minExpiryDate = new Date(moment(response['endDate']).format());
                    }

                    this.buildEditProgramForm(response);

                    
                    if (null != response['skuCodes'] && response['skuCodes'].length != 0) {
                        this.selectedProduct = response['skuCodes'];
                        this.selectedCount = response['skuCodes'].length;
                    }
                    // this.tierArrayForm(response['pointWorths']);
                    //  this.regionCurrencies = response['pointWorths'];
                    //   this.descriptionFormArray(response['programLocales']);
                    //   this.programFormArray(response['programLocales']);
                    this.statusValue = response['status'];
                    this.toggleVal = response['status'] == 'ONLINE' ? true : false;
                    //this.minDate = response['startDate'];

                    this.imagePath = response['programImgPath'];
                    this.skuFile = response['skuFilePath'];

                    this.programData = response;
                    this.getRewardType(this.programData['programType']);
                },
                (error) => {
                    console.log(error);
                }
            );
    }
    public uploadImage(event: FileList) {
        if (event[0].size < 1000000) {
            this.imageUploading = true;
            if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG"
                || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
                this.uploadFile.upload(event.item(0), 'program', 'images')
                    .subscribe((response) => {
                        console.log(response);
                        this.imagePath = response['message'];
                        this.imageUploading = false;
                        this.showImageError = false;
                        this.uploadImgElRef.nativeElement.value = ''

                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });


                    }, err => {

                        console.log("error Status = " + err);
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: "Supported format is JPG, JPEG and PNG"
                                }
                            });
                        } else {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: "Internal server error"
                                }
                            });
                        }

                    }
                    )
            } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Supported format is JPG, JPEG and PNG"
                    }
                });
            }
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Max upload file size is 1Mb"
                }
            });
        }

    }

    uploadSkuFile(event: FileList) {
        if (event[0].type == "application/vnd.ms-excel") {
            this.uploadFile.upload(event.item(0), 'program', 'files')
                .subscribe((response) => {
                    this.skuFile = response['message'];
                    this.validateSku();
                }, err => {
                    if (err.error.errorType == 'VALIDATION') {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.errorDetails[0].description
                            }
                        });
                    }

                });
        } else {
            this.skuFile = '';
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Supported format is xls"
                }
            });

        }

    }
    public removeSku() {
        this.skuFile = '';
    }

    validateSku() {
        let VALIDATE_SKU_FILE = environment.APIEndpoint + "api/rpa/loyalty/program/v1/skufile/validate";
        let request = {
            filePath: this.skuFile
        }
        this.http.postJson(VALIDATE_SKU_FILE, request)
            .subscribe((response) => {
                console.log(response);
                this.validateSkuFile = true;
            }, err => {
                this.validateSkuFile = false;
            })
    }

    // checkLimitPerCustomer(overAllAccurals, limitperCustomer, dailyLimit){
    //     //console.log("overAllAccurals = "+overAllAccurals+" || limitperCustomer = "+limitperCustomer+" || dailyLimit= "+dailyLimit);
    //     if(overAllAccurals=='' && limitperCustomer!='')
    //         this.limitPerCustFlag=true;
    //     if(overAllAccurals!='' && limitperCustomer!=''){
    //         if(parseInt(limitperCustomer) > parseInt(overAllAccurals))
    //             this.limitPerCustFlag=true;
    //         else
    //             this.limitPerCustFlag=false;
    //     }
    //     if(dailyLimit!='' && limitperCustomer!=''){
    //         if(parseInt(dailyLimit) > parseInt(limitperCustomer))
    //             this.dailyLimitFlag=true;
    //         else
    //             this.dailyLimitFlag=false;
    //     }
    // }
    public removeImage(index) {
        this.imagePath = "";


    }

    updateProgram(formData) {
        console.log(this.programFormGroup);
        this.regionError = false;
        this.rewardArr = [];
        this.programLocales = [];
        this.descriptionError = false;
        let descError;

        // for(let cn of formData.tierArray[1].currencyArr) {
        //     var key = Object.keys(cn)
        //     if(cn[key[0]]==''){
        //         this.regionError=true;
        //     }
        // }

        this.programFormGroup.get('startTime').markAsPristine;
        this.programFormGroup.get('endTime').markAsPristine;
        if (this.programFormGroup.invalid == true || this.regionError) {

            this.markFormGroupTouched(this.programFormGroup);
            this.descriptionError = descError;
            this.showError = true;
        } else if (this.imagePath == '') {
            this.showImageError = true;
        }
        // else if(formData.programType!='BASE' && this.skuFile==''){
        //     this.uploadSkuFlag=true;
        // }
        else {
            // for(let t of formData.tierArray) {
            //     for(let i=0;i<t.currencyArr.length;i++) {
            //         var key = Object.keys(t.currencyArr[i])
            //         this.rewardArr.push(
            //             {
            //                 regionId:parseInt(key[0]),//int
            //                 tierId:parseInt(t.tierId),//int
            //                 rewardValue:parseInt(t.currencyArr[i][key[0]])//int
            //             })
            //     }
            // }

            for (let i = 0; i < this.languageList.length; i++) {
                if (this.languageList[i].languageCode == "EN") {
                    let locale = {
                        languageId: this.languageList[i].languageId,
                        programName: formData.programName,
                        programDescription: formData.descriptionCtrl
                    }
                    this.programLocales.push(locale);
                }
            }


            let request = {
                programId: this.programId,
                programType: this.programData['programType'],
                brandId: this.programData['brand'] != null ? this.programData['brand']['brandId'] : '',
                freeProductType: this.freeProductCodeValue,
                productBrandType: this.programData['productBrandType'] != null ? this.programData['productBrandType'] : null,
                skuFilePath: this.skuFile,
                skuCodes: this.selectedProduct,
                programLocales: this.programLocales,
                programImgPath: this.imagePath,
                rewardType: formData.rewardType,
                startDate: moment(formData.startDate).format('YYYY-MM-DD'),
                endDate: formData.endDate != '' ? moment(formData.endDate).format('YYYY-MM-DD') : '',
                isPerpetual: formData.perceptual,
                startTime: formData.startTime != '' ? moment(formData.startTime).format('HH:mm:ss') : '',//"12:10:11",
                endTime: formData.endTime === '' ? '' : moment(formData.endTime).format('HH:mm:ss'),
                pointExpiryIn: formData.pointExpiryIn == '' ? null : formData.pointExpiryIn,
                expiryDate: formData.expiryDate == '' ? null : moment(formData.expiryDate).format('YYYY-MM-DD'),
                expiryDays: formData.numberOfDays,//int
                isEndOfMonth: formData.isEndOfMonth,
                isAllowExtension: formData.isAllowExtension,
                //    maxOverallAccrual:formData.overallAccurals, //int
                //    overallLimitPerCustomer:formData.overAllLimit,//12,
                //    dailyCustomerLimit:formData.dailyLimit,//10,
                status: this.statusValue,
                //rewardValues:this.rewardArr,
                validateSku: this.validateSkuFile
            }
            this.loading = true;

            let UPDATE_PROGRAM = environment.APIEndpoint + "api/rpa/loyalty/program/v1/update";
            this.http.postJson(UPDATE_PROGRAM, request)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Program has been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-programs']);
                }
                    , err => {
                        this.loading = false;
                        console.log("error Status = " + err);
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "failure",
                                    message: err.error.errorDetails[0].description
                                }
                            });
                        } else {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "failure",
                                    message: "Your request cannot be saved at this time. Please try again later"
                                }
                            });
                        }
                    })

        }


    }
    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
    }

    public viewEarnRuleList() {
        let GET_EARN_RULE_BY_PROGRAM_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/get/list";
        this.http.getJson(GET_EARN_RULE_BY_PROGRAM_ID + "?programId=" + this.programId)
            .subscribe((response) => {
                console.log(response);
                this.earnRuleList = response;
                this.earnDataSource = new MatTableDataSource(response);
                this.earnDataSource.sort = this.sort;
            })

    }
    public ViewBurnRuleById() {
        let request = {
            programId: this.programId,
            status: "ONLINE"

        }
        let GET_BURN_RULE_BY_PROGRAM_ID = environment.APIEndpoint + "api/rpa/burn/rule/v1/program/view";
        this.http.postJson(GET_BURN_RULE_BY_PROGRAM_ID, request)
            .subscribe((response) => {
                this.burnRuleList = response;
                this.burnDataSource = new MatTableDataSource(response);
                this.burnDataSource.sort = this.sort;
            })
    }
    public dateValidation() {
        this.minDate = new Date();
        let startDateControl = this.programFormGroup.get('startDate');
        startDateControl.updateValueAndValidity();
    }

    public getCurrencyConversionValue() {

        let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/get/conversionRate"
        this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                console.log(response);
                this.conversionList = response;
            })
    }

    public autoPopulateCurrencyValue(column, row, baseCurValue) {
        let regex = /^[0-9]*$/;
        if (baseCurValue != '') {
            let valid = baseCurValue.match(regex)
            if (!valid) {
                this.rewardErrMsg = true;
            } else {
                this.rewardErrMsg = false;
                if (row == 0 && column != undefined && baseCurValue != "") {
                    let rewardCurrency = this.regionCurrencies[0]['rewardValues'];
                    for (let i = 1; i < rewardCurrency.length; i++) {
                        for (let conversion of this.conversionList) {
                            const array = <FormArray>column.controls['currencyArr'];
                            if (conversion.currencyCode === rewardCurrency[i].currencyCode) {
                                let conversionValue = conversion.conversionValue * parseInt(baseCurValue)
                                array.at(i).patchValue({
                                    [rewardCurrency[i].regionId]: [Math.round(conversionValue)]
                                });
                                array.markAsPristine;
                            }
                        }
                        //array.push(arr);
                    }


                }
            }
        }

    }
    checkPointExpiryValidation(pointExpiryIn) {

        let expiryDate = this.programFormGroup.get('expiryDate');
        let numberOfDays = this.programFormGroup.get('numberOfDays');
        let isAllowExtension = this.programFormGroup.get('isAllowExtension');
        let isEndOfMonth = this.programFormGroup.get('isEndOfMonth');
        if (pointExpiryIn == 'FIXEDDATE') {
            numberOfDays.markAsPristine;
            numberOfDays.clearValidators();
            numberOfDays.setValue('');
            expiryDate.setValidators([Validators.required]);
            numberOfDays.updateValueAndValidity();
            expiryDate.updateValueAndValidity();
            this.minExpiryDate = new Date(moment(new Date(this.programFormGroup.get("endDate").value)).format());
        } if (pointExpiryIn == 'NOOFDAYS') {
            isAllowExtension.setValue(false);
            isEndOfMonth.setValue(false);
            expiryDate.markAsPristine;
            expiryDate.clearValidators();
            expiryDate.setValue('');
            numberOfDays.setValidators([Validators.required]);
            expiryDate.updateValueAndValidity();
            numberOfDays.updateValueAndValidity();
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    productsDialog() {
        const dialogRef = this.dialog.open(productsDialog);
        dialogRef.componentInstance.productList = this.selectedProduct;
        dialogRef.componentInstance.programOid = this.programId;
        dialogRef.componentInstance.excludeToggle = true;
        dialogRef.componentInstance.seletedTabIndex = 0;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'UPLOAD') {
                    this.skuFile = result.skuFileName;
                }
                if (result.buttonName === 'SELECT') {
                    this.skuFile = result.skuFileName;
                    this.selectedCount = result.tableData.length;
                    if (this.selectedCount != 0 || this.skuFile != '') {
                        for (let i = 0; i < result.tableData.length; i++) {
                            let skuId = result.tableData[i].skuCode;
                            this.selectedProduct.push(skuId);
                        }
                    } else {
                        this.productErrorMsg = "Please select Product SKU or Products";

                    }
                    this.selectedProduct = result.tableData.map(a => a.skuCode)
                }
            }
        );
    }
    viewEarnRule(earnRuleId){
        localStorage.setItem('ViewEarnID',earnRuleId);
        // localStorage.removeItem('EditID');
        this.router.navigate(['/view-earn-rule']);
    }


    getBrandValue(val) {
        console.log(val);
        this.pointbrandIdValue = val;
        this.getFreeProduct(this.pointbrandIdValue);
      }

    getFreeProduct(brandId) {
        console.log(brandId);
        
        this.pointbrandIdValue = brandId;
        let GET_FREE_PRODUCTS_VALUE = environment.APIEndpoint + "api/rpa/master/freeProduct/v1/list/" + this.pointbrandIdValue;
        this.http.getJson(GET_FREE_PRODUCTS_VALUE).subscribe(
            (response) => {
                console.log(response);
                this.freeproductvalues = response['freeProductType'];
                console.log(this.freeproductvalues);
                
            }
        )
    }
    getfreeproductvalue(freeProductCode){
        this.freeProductCodeValue = freeProductCode;
    }

}
