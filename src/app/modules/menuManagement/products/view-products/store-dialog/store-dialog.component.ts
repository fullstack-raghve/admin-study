import { OnInit, ViewChild, Input, Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'store-dialog',
  templateUrl: './store-dialog.component.html',
  styleUrls: ['./store-dialog.component.scss']
})

export class StoreDialogComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'storeId', 'storeName', 'country', 'currencyCode'];
  @Input('storeList') storeList = [];
  @Input('totalCount') totalCount = [];
  @Input('isDisabled') isDisabled: boolean = false;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  loadingResponse: boolean = true;
  disabledTable: boolean = true;
  totalFilterRecordVal: boolean = true;
  public editStoreForm: FormGroup;
  public paginationData;
  public Obj;
  public resultsLength = 0;
  public cities: any = [];
  public countries: any = [];
  public selectAll: boolean = false;
  public noRecords: boolean = false;
  public totalRecordVal: boolean = false;
  public brandList = [];
  public arrlength = [10, 20, 50, 100];
  public total: number;
  public updatedTotal;
  public paginatorArray;
  public selectedArray;
  public getSelected = [];
  dataSourceAll;
  public selectedCount = 0;
  public countryOid: number;
  public cityOid: number;
  status = true;
  variantsTypes: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar,
    private http: HttpService) {
    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
  }
  public selection = new SelectionModel(true, []);

  ngOnInit() {
    this.buildForm();
    this.getVariantList(this.editStoreForm.value);
    this.getAllCountries();
    this.variantsTypes = this.data.variantsTypes;
    this.patchVariantsFormValue(this.data.tierdata);
  }

  buildForm() {
    this.editStoreForm = this.fb.group({
      searchtxt: [""],
      cityName: [""],
      countryName: [""],
      status: [""],
    });
  }


  patchVariantsFormValue(formValue) {
    this.editStoreForm.patchValue({
      // tierId: formValue.tierId,
      // name: formValue.tierName,
      // minValue: formValue.minAmount,
      // maxValue: formValue.maxAmount
    })
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;
      })
  }

  getAllCities(countryId) {
    this.countryOid = countryId;
    this.cityOid = 0;
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
      .subscribe((response) => {
        console.log(response);
        this.cities = response;
      })
  }

  openFilter() {
    this.status = !this.status;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;
    this.selectedArray = this.selection.selected;

    return numSelected === numRows;
    console.log(numSelected);

  }


  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.selection.selected,
      'totalCount': this.resultsLength
    }
    this.dialogRef.close(obj);

  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getVariantList(this.editStoreForm.value);
  }

  getStoreData(paginator) {
    console.log(paginator);
  }

  cityDetails(value: number) {
    this.cityOid = value;
  }

  getVariantList(formData) {
    console.log(this.totalCount);
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : this.totalCount,
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "country.oid",
          "fieldValue": formData ? formData.countryName : "",
        },
        {
          "fieldName": "city.oid",
          "fieldValue": formData ? formData.cityName.toString() : "",
        }
      ]
    }

    console.log(data.fieldSearch['fieldValue'] == !"");
    if (data.fieldSearch['fieldValue'] == !"") {
      console.log("not empty")
    }
    // this.loadingResponse = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      // this.loadingResponse = false;
      this.totalRecordVal = true;
      this.totalFilterRecordVal = true;
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSourceAll = this.dataSource;
      console.log(this.dataSourceAll);
      alert("data source" + this.dataSourceAll);
      this.resultsLength = res["totalCount"];
      alert("result length" + this.resultsLength);
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.total = res["totalCount"];
      console.log(this.total);

      if (this.total == 0) {
        this.disabledTable = true;
      } else {
        this.disabledTable = false;
      }

      console.log(res);

      if (this.storeList.length > 0) {
        console.log(this.storeList.length);

        for (let i of this.dataSource.data) {
          if (this.storeList.indexOf(i["storeOid"]) > -1) {
            this.selection.select(i);
          }
        }
      } else if (this.selectAll) {
        for (let i of this.dataSource.data) {
          this.selection.select(i);
        }
      }

    }, err => {
      console.log(err);
      this.loadingResponse = true;
    })
  }
  public updateTotal(total) {
    setTimeout(function () {
      this.loadingResponse = true;
    }, 500);

    let updatedTotal = total;
    this.arrlength.push(updatedTotal);
    console.log(this.arrlength);
    const arrray = this.arrlength;
    console.log(arrray);
    this.arrlength = Array.from(new Set(arrray));
    console.log(this.arrlength);
    this.arrlength = this.arrlength.filter(function (element) {
      return element !== undefined;
    });
  }

  public updateCheck(i) {
    console.log(i);
  }

  public doSelectAll(formData) {
    console.log(formData);
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : this.totalCount,
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "country.oid",
          "fieldValue": formData ? formData.countryName : "",
        },
        {
          "fieldName": "cityOids",
          "fieldValue": formData ? formData.cityName.toString() : "",
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      console.log(res);

    })
  }
}