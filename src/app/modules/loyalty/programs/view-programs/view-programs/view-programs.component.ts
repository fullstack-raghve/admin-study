import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Sort } from '@angular/material/sort';
import { AuditlogDialogComponent } from '../../../../../shared/components/auditlog-dialog/auditlog-dialog.component';



export interface UserData {
    ruleName: string;
    actionType: string;
    action: string;
    startDate: string;
    endDate: string;
}

@Component({
    selector: 'view-programs',
    templateUrl: './view-programs.component.html',
    styleUrls: ['./view-programs.component.scss']
})
export class ViewProgramsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Programs',
        link: '/search-programs'
    }
    ];


    @ViewChild("createProgramForm") createProgramForm;
    public menuIds: any = localStorage.getItem("navigationArray");
    programFormGroup: FormGroup;
    selectedProgramType = 'Base';
    public programId: any;
    public editProgramId: number = 0;
    public searchStoreVal: boolean = false;
    public noRecords: boolean = false;
    public programData = [];
    public brand;
    public resultsLength = 0;
    public showApprovalBtn = false;
    baseUrl: any = '';
    url: any = '';
    isChecked = false;
    currencies = [];
    public startDate;
    public endDate;
    public rewardTypes;
    public expiryDate = false;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    panelOpenState;
    createTemplate;
    public earnRuleList = [];
    public burnRuleList = [];
    displayedColumns: string[] = ['ruleName', 'actionType', 'action', 'maxOverallAccrual', 'overallLimitCustomer', 'dailylLimitCustomer', 'remainingPoints', 'startDate', 'endDate'];
    burnDisplayedColumns: string[] = ['ruleName', 'rewardType', 'redeemQty', 'startDate', 'endDate'];
    earnDataSource: MatTableDataSource<UserData>;
    burnDataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @ViewChild('sorter1') sorter1: MatSort;
    @ViewChild('sorter2') sorter2: MatSort;

    public imgUpload = false;
    public alignCss = [];
    public skuFile = '';
    public skuFileName = "";
    public descriptionText = [];
    public selectedCount = 0;
    public isEndDateExpired = false;
    public statusValue = 'ONLINE'
    public toggleVal;
    public updatePermission = true;
    public sortColumn = "modifiedTime";
    public sortDirection = "desc";
    public programName: String;
    public programDesc: String;
    // @ViewChild(MatSort, {static: true}) sort: MatSort;
    public fileUrl = localStorage.getItem("fileBaseUrl");

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpService, public snackBar: MatSnackBar,
        private sanitized: DomSanitizer, public dialog: MatDialog, ) {
        // this.activatedRoute.params.subscribe(
        //     (params) => {
        //         this.programId = +(params.id)
        //     }
        // );
        this.buildCreateProgramForm();
    }


    ngOnInit() {
        if (localStorage.getItem('ViewID')) {
            this.programId = localStorage.getItem('ViewID');
            this.getProgramDetails();
            this.viewEarnRuleList();
            this.ViewBurnRuleById();
            if (this.menuIds.indexOf('3003005') > -1) {
                this.showApprovalBtn = true;
                this.updatePermission = false;
            }
            localStorage.removeItem('ViewID')
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-programs']);
        }

        //   this.burnDataSource.sort = this.sort;
    }

    public buildCreateProgramForm() {
        let form = {
            programType: ["", Validators.required],
            programName: ["", Validators.required],
            description: ["", Validators.required],
            rewardType: ["", Validators.required],
            startDate: ["", Validators.required],
            endDate: ["", Validators.required],
            pointExpiryIn: ["", Validators.required],
            expiryDate: ["", Validators.required],
            numberOfDays: ["", Validators.required],
            selectBrand: ["", Validators.required],
            overallAccurals: ["", Validators.required],
            overAllLimit: ["", Validators.required],
            dailyLimit: ["", Validators.required],
            descriptionArray: this.fb.array([])
        }
        this.programFormGroup = this.fb.group(form);
        this.descriptionFormArray();
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
        this.updateStatus(this.statusValue);
    }

    updateStatus(status: any) {
        let body = {
            programId: this.programId,
            status: status
        }

        let SEND_FOR_APPROVAL = environment.APIEndpoint + "api/rpa/loyalty/program/v1/update/status";
        this.http.postJson(SEND_FOR_APPROVAL, body)
            .subscribe((response) => {
                let approvalMsg = "Program status updated successfully";
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: approvalMsg
                    }
                });
            }, err => {
                console.log("error Status = " + err);
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }

                });


            });


    }

    getProgramDetails() {
        let body = {
            programId: this.programId
        }
        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.http.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    console.log(response);

                    let pointExpiry = response['pointExpiryIn'];
                    if (pointExpiry != "NOOFDAYS") {
                        this.expiryDate = true;
                    }
                    this.selectedCount = null == response['skuCodes'] ? 0 : response['skuCodes'].length;


                    this.skuFile = response['skuFilePath'];
                    if (this.skuFile != '' && this.skuFile != null) {
                        this.skuFileName = this.skuFile.split("/").pop();
                    }

                    if (response['startTime'] != null) {
                        this.startDate = new Date();
                        let startTime = response['startTime'].split(":");
                        this.startDate.setHours(startTime[0]);
                        this.startDate.setMinutes(startTime[1]);
                    }
                    if (response['endTime'] != null) {
                        this.endDate = new Date();
                        let endTime = response['endTime'].split(":");
                        this.endDate.setHours(endTime[0]);
                        this.endDate.setMinutes(endTime[1]);
                    }


                    this.programData = response;
                    this.rewardTypes = response['pointWorths'];
                    this.statusValue = response['status'];
                    this.toggleVal = response['status'] == 'ONLINE' ? true : false;
                    for (let p of response['programLocales']) {
                        this.alignCss.push(p.direction == 'RTL' ? 'text-right' : '');
                    }
                    // for (let type of this.rewardTypes[0].rewardValues) {
                    //     this.currencies.push(type.currencyCode);
                    // }
                    let brand = this.programData['brand'];
                    if (brand == null) {
                        this.brand = "";
                    } else {
                        this.brand = brand.brandName
                    }
                    let currentDate = moment(new Date()).format('YYYY-MM-DD');
                    let endDate = moment(new Date(response['endDate'])).format('YYYY-MM-DD');
                    if (null != response['endDate'] && currentDate > endDate) {
                        this.isEndDateExpired = true;
                    }
                    if (null != response['upcomingProgramOid']) {
                        this.editProgramId = response['upcomingProgramOid'];
                    } else {
                        this.editProgramId = this.programId;
                    }
                    this.getText(this.programData);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    public getText(TextData) {
        for (var i = 0; i < TextData.programLocales.length; i++) {
            this.descriptionText.push(this.sanitized.bypassSecurityTrustHtml(TextData.programLocales[i].programDescription));
        }
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


    public descriptionFormArray() {
        const controls = <FormArray>this.programFormGroup.controls['descriptionArray'];
        for (let language of this.languageList) {
            let control = this.fb.group({
                description: ['']
            });
            controls.push(control);
        }
    }
    public viewEarnRuleList() {
        this.searchStoreVal = true;
        let GET_EARN_RULE_BY_PROGRAM_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/get/list";
        this.http.getJson(GET_EARN_RULE_BY_PROGRAM_ID + "?programId=" + this.programId)
            .subscribe((response) => {
                this.searchStoreVal = false;
                console.log(response);
                this.earnRuleList = response;
                if (this.earnRuleList.length == 0) {
                    this.noRecords = true;
                } else {
                    this.noRecords = false;
                }
                this.earnDataSource = new MatTableDataSource(this.earnRuleList);
                // this.earnDataSource.sort = this.sort;
                this.earnDataSource.sort = this.sorter1;
            },
                (error) => {
                    console.log(error);
                    this.searchStoreVal = true;
                })

    }
    public ViewBurnRuleById() {
        this.searchStoreVal = true;
        let request = {
            programId: this.programId,
            //status:"ONLINE"

        }
        let GET_BURN_RULE_BY_PROGRAM_ID = environment.APIEndpoint + "api/rpa/burn/rule/v1/program/view";
        this.http.postJson(GET_BURN_RULE_BY_PROGRAM_ID, request)
            .subscribe((response) => {
                this.searchStoreVal = false;
                this.burnRuleList = response;
                this.burnDataSource = new MatTableDataSource(this.burnRuleList);
                // this.burnDataSource.sort = this.sort;
                this.burnDataSource.sort = this.sorter2;
                if (this.burnRuleList.length == 0) {
                    this.noRecords = true;
                } else {
                    this.noRecords = false;
                }
            },
                (error) => {
                    console.log(error);
                    this.searchStoreVal = true;
                }
            )
    }

    public sendForApproval() {
        let request = {
            programId: this.programId,
        }
        let SEND_FOR_APPROVAL = environment.APIEndpoint + "api/rpa/loyalty/program/v1/status/change"
        this.http.postJson(SEND_FOR_APPROVAL, request)
            .subscribe((response) => {
                let approvalMsg;
                if (this.programData['approvedStatus'] == 'NEW') {
                    approvalMsg = 'Program has been sent for Approval';
                } else {
                    approvalMsg = 'Program has been Approved successfully to go live on the Program Start date';
                }
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: approvalMsg
                    }
                });
                this.getProgramDetails();


            }, err => {
                console.log("error Status = " + err);
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
                        duration: 1500,
                        data: {
                            status: "error",
                            message: "Internal server error"
                        }

                    });
                }

            });

    }


    sortData(sort: Sort) {
        if (this.earnDataSource) {
            if (!sort.active || sort.direction === '') {
                this.sortColumn = "modifiedTime";
                this.sortDirection = "desc";
            } else {
                this.sortColumn = sort.active;
                this.sortDirection = sort.direction;
            }
            this.viewEarnRuleList();
        }
    }
    sortDataBurn(ev) {
        console.log(ev)
        // console.log(sort);
        // if (!sort.active || sort.direction === '') {
        //     this.sortColumn = "modifiedTime";
        //     this.sortDirection = "desc";
        // } else {
        //     this.sortColumn = sort.active;
        //     this.sortDirection = sort.direction;
        // }

        this.burnDataSource.sort = this.sorter2;
        if (!ev.active || ev.direction === '') {
            this.sort.direction = "desc"
        } else {
            this.sort.direction = "asc"
        }
        this.ViewBurnRuleById();
        // const sortState: Sort = { active: 'ruleName', direction: 'desc' };
        // console.log(sortState);

        // this.sort.active = sortState.active;
        // this.sort.direction = sortState.direction;
        // this.sort.sortChange.emit(sortState);
    }
    moveToEdit() {
        localStorage.setItem('EditID', this.programId);
        // localStorage.removeItem('ViewID');
        this.router.navigate(['/edit-programs']);
    }
    viewEarnRule(earnRuleId) {
        localStorage.setItem('ViewEarnID', earnRuleId);
        // localStorage.removeItem('ViewID');
        this.router.navigate(['/view-earn-rule']);
    }
    ViewBurnRule(burnRuleId) {
        localStorage.setItem('ViewBurnID', burnRuleId);
        this.router.navigate(['/view-burn-rule']);
    }
    auditLogDialog() {
        const dialogRef = this.dialog.open(AuditlogDialogComponent);
        dialogRef.componentInstance.programId = this.programId;
    }
}
