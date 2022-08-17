import { OnInit, ViewChild, Component, Inject, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA
} from "@angular/material";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import * as moment from "moment";
import { Router } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
export interface UserData {
  flowId: string;
  flowName: string;
  createdTime: string;
  preview: any;
  // status: string;
}

@Component({
  selector: "app-add-flow-dialog",
  templateUrl: "./add-flow-dialog.component.html",
  styleUrls: ["./add-flow-dialog.component.scss"]
})
export class AddFlowDialogComponent implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };

  @ViewChild("searchFlowForm") searchFlowForm;
  searchFlowFormGroup: FormGroup;
  displayedColumns: string[] = [
    "select",
    "flowId",
    "flowName",
    "communicationType",
    "feedbackCount",
    "createdTime",
    "preview"
  ];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  public flowURL: string = "";
  public flowId: number;
  @Input('couponList') flowList = [];

  public status: boolean = true;
  public selection = new SelectionModel(true, []);

  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    private dialogRef: MatDialogRef<MatDialog>,
    public dialog: MatDialog,
    public router: Router, @Inject(MAT_DIALOG_DATA) data
  ) {

    dialogRef.disableClose = true;
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/, "");
    console.log(this.flowURL);

    if (data != null) {
      this.flowId = data.flowId
    }
  }

  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    // this.flowAPI = this.flowAPI.replace(/\:8080.*/,'');
    // this.href = this.router.url;
  }

  public buildSearchForm() {
    this.searchFlowFormGroup = this.fb.group({
      flowId: [""],
      flowName: [
        "",
        Validators.pattern("[a-zA-Z\u0600-\u06FF \"&'(),-:.?_ ]*")
      ],
      createdTime: [""],
      fromDate: [""],
      endDate: [""],
      searchVal: [""]
    });
  }

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  getUpdate(event) {
    console.log(event);
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  onCloseClick(): void {
    let obj = {
      buttonName: "CANCEL"
    };
    this.dialogRef.close(obj);
  }


  searchVal() {
    if (this.searchFlowFormGroup.invalid == false) {
      let formdata = this.searchFlowFormGroup.value;
      let data = {
        page:
          this.paginationData !== undefined
            ? this.paginationData.pageIndex
            : "0",
        pageSize:
          this.paginationData !== undefined
            ? this.paginationData.pageSize
            : "10",
        order: {
          column: "modifiedTime",
          dir: "desc"
        },
        keySearch: formdata.searchVal,
        fieldSearch: [
          // {
          //   "fieldName": "flowId",
          //   "fieldValue": formdata.flowId
          // },
          // {
          //   "fieldName": "flowName",
          //   "fieldValue": formdata.flowName
          // },
          {
            fieldName: "fromDate",
            fieldValue:
              formdata.fromDate != ""
                ? moment(formdata.fromDate).format("YYYY-MM-DD")
                : ""
          },
          {
            fieldName: "toDate",
            fieldValue:
              formdata.endDate != ""
                ? moment(formdata.endDate).format("YYYY-MM-DD")
                : ""
          },

          {
            fieldName: "smsType",
            fieldValue: "YES"
          },
          {
            fieldName: "emailType",
            fieldValue: "YES"
          }
        ]
      };
      this.https
        .postJson(
          environment.APIEndpoint + "api/rpa/feedback/flow/v1/search",
          data
        )
        .subscribe(
          res => {
            this.resultsLength = res["totalCount"];
            this.dataSource = new MatTableDataSource(res["items"]);
            this.dataSource.sort = this.sort;
            this.buildFlag = true;
            console.log(this.flowList);
            if (this.flowList.length > 0) {
              for (let i of this.dataSource.data) {
                if (this.flowList.indexOf(i["flowId"]) > -1) {
                  this.selection.select(i);
                }
              }
            }
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  reset() {
    this.buildSearchForm();
    this.searchVal();
  }
}
