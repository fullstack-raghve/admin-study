import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';


export interface UserData {
    couponId: number;
    couponTitle: string;
    discountType: string;f
    discountValue: string;
    startDate: string;
    endDate: string;
    // delete: string;
}
@Component({
    selector: 'view-notifications',
    templateUrl: './view-notifications.component.html',
    styleUrls: ['./view-notifications.component.scss'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }]
})
export class ViewNotificationsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }, {
        title: 'Campaigns',
        link: 'view-campaign'
    }
    ];
    selectStoreValPass;
    public transactedBrands: boolean = false;
    public transactedStores: boolean = false;
    public fileImgPathUrl = localStorage.getItem("imgBaseUrl");
    public selectedStoreLength;
    displayedColumns: string[] = ['couponId', 'couponTitle', 'discountType', 'discountValue', 'startDate', 'endDate'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild("viewCampaignForm") viewCampaignForm;
    storeInclude: boolean = false;
    storeExclude: boolean = false;
    firstFormGroup: FormGroup;
    public viewNotificationData;
    public showError: boolean = false;
    public loading: boolean = false;
    public statusValue: string = 'OFFLINE';
    public emailChecked: boolean = false;
    public pushChecked: boolean = false;
    public smsChecked: boolean = false;
    public notificationId;
    public notificationData: any = [];
    public viewCouponsData;
    public communicationTypes = [];
    public languageDirection = [];
    public langfield = [];
    public langfieldname = [];
    public attachCoupon: boolean = false;
    public noofTransactionSelect: boolean = false;
    public coursesSelect: boolean = false;
    public languages = JSON.parse(localStorage.getItem("languageList"));
    checked = true;
    disabled = true;
    panelOpenState = false;
    public selectedStore = [];
    selectedStoreCount: any;
    preview = [];


    constructor(private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
        private http: HttpService, public snackBar: MatSnackBar, public dialog: MatDialog) {
    }

    ngOnInit() {
        let data = localStorage.getItem('NotificationViewID');
        if (data) {
            this.notificationId = data;
            this.getNotificationDataById();
            this.firstFormGroup = this._formBuilder.group({
            });

            for (let i = 0; i < this.languages.length; i++) {
                this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                this.langfield.push(this.languages[i].direction == 'RTL' ? 'text-align' : '');
                this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'lang-name-right' : '');
                this.preview.push(this.languages[i].direction == 'RTL' ? 'preview' : '');
            }
            localStorage.removeItem('NotificationViewID')
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-notifications'])
        }

    }

    getNotificationDataById() {
        let GET_NOTIFICATION_DATA_BY_ID = environment.APIEndpoint + "api/rpa/notification/v1/view";
        let request = {
            notificationId: this.notificationId
        }

        this.http.postJson(GET_NOTIFICATION_DATA_BY_ID, request)
            .subscribe((response) => {
                this.notificationData = response;
                if (this.notificationData['notificationDetails']['stores'] != null) {
                    this.selectedStoreLength = this.notificationData['notificationDetails']['stores'].length;
                }
                this.viewNotificationData = this.notificationData['notificationDetails'];

                if (this.notificationData['notificationDetails'].isExcludeStore == 'true') {
                    this.storeInclude = false;
                    this.storeExclude = true;
                } else if (this.notificationData['notificationDetails'].isExcludeStore == 'false') {
                    this.storeInclude = true;
                    this.storeExclude = false;
                }
                if (this.notificationData.coupons != null) {
                    this.dataSource = new MatTableDataSource(this.viewNotificationData['coupons']);
                    if (this.viewNotificationData['coupons'].length != null && this.viewNotificationData['coupons'].length > 0 && this.viewNotificationData['coupons'] != null) {
                        this.attachCoupon = true;
                    } else {
                        this.attachCoupon = false;
                    }
                }

                if (this.selectedStoreLength != null) {
                    this.selectStoreValPass = this.notificationData['notificationDetails']['stores'];
                    this.selectedStoreLength = this.notificationData['notificationDetails']['stores'].length;
                    if (this.notificationData['notificationDetails']['stores'].length > 0) {
                        this.noofTransactionSelect = true;
                    } else {
                        this.noofTransactionSelect = false;
                    }
                }

                let temp;
                if (this.notificationData.notificationDetails.emailContent.emailContentLocale != undefined) {
                    this.notificationData.notificationDetails.emailContent.emailContentLocale.forEach(element => {
                    });
                }
                this.checked = this.notificationData.notificationDetails.status == 'ONLINE' ? true : false
                this.statusValue = this.notificationData.notificationDetails.status == "ONLINE" ? 'ONLINE' : 'OFFLINE';

                this.communicationTypes = this.notificationData.notificationDetails.communicationType
                if (this.communicationTypes.includes('EMAIL')) {
                    this.emailChecked = true;
                }
                if (this.communicationTypes.includes('PUSH')) {
                    this.pushChecked = true;
                }
                if (this.communicationTypes.includes('SMS')) {
                    this.smsChecked = true;
                }
            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                });

    }
    
    MoveToEdit(ID) {
        localStorage.setItem('NotificationEditID', ID);
        this.router.navigate(['/edit-notifications'])
    }


    openStoresDialog() {
        const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
            panelClass: 'custom-modalbox'
        });
        dialogRef.componentInstance.selectedStoreData = this.selectStoreValPass;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'SELECT') {
                    this.selectedStore = [];
                    this.selectedStoreCount = result.tableData.length;
                    if (this.selectedStoreCount != 0) {
                        for (let i = 0; i < result.tableData.length; i++) {
                            let storeId = result.tableData[i].storeOid;
                            this.selectedStore.push(storeId);
                            const arrrayTemp = this.selectedStore;
                            this.selectedStore = Array.from(new Set(arrrayTemp));
                        }
                    }
                }
            });
    }
}
