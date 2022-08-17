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
  selector: "app-selected-feedback-flow",
  templateUrl: "./selected-feedback-flow.component.html",
  styleUrls: ["./selected-feedback-flow.component.scss"]
})
export class SelectedFeedbackFlowComponent implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };

  @ViewChild("searchFlowForm") searchFlowForm;
  searchFlowFormGroup: FormGroup;
  displayedColumns: string[] = ["select", "flowName"];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  public flowURL: string = "";
  public flowId: number;
  @Input("flowList") flowList = [];
  minDate = new Date();
  startDate;
  endDate;
  public status: boolean = true;
  public selection = new SelectionModel(true, []);
  public selectedFlowForm: FormGroup;
  selectedFlowData = {
    startFlowDate: "",
    endFlowDate: "",
    startFlowTime: "",
    endFlowTime: ""
  };
  kioskData: any;

  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    private dialogRef: MatDialogRef<MatDialog>,
    public dialog: MatDialog,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data['selectedFlow'].length != 0) {
      console.log(data);
    }

    dialogRef.disableClose = true;
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/, "");
    // console.log(this.flowURL);

    if (data != null) {
      this.flowId = data.selectedFlow.flowId;
    }
    this.kioskData = data;
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
  showerrors = false;
  selectedFlow(flow, formFlow) {
    console.log(flow);
    if (flow.length != 0 && formFlow.valid) {
      this.showerrors = false;
      var getSelectedFlow = flow.slice(-1)[0];
      var reqyBody = {
        flowOid: getSelectedFlow.flowId,
        flowName: getSelectedFlow.flowName,
        startDate: moment(this.selectedFlowData["startFlowDate"]).format(
          "YYYY-MM-DD"
        ),
        endDate: moment(this.selectedFlowData["endFlowDate"]).format(
          "YYYY-MM-DD"
        ),
        startTime: moment(this.selectedFlowData["startFlowTime"]).format('HH:mm:ss')
        // endTime: "23:59:59"
      };
      console.log(reqyBody);
      this.dialogRef.close(reqyBody);
    } else {
      this.showerrors = true;
    }
  }

  // searchVal() {
  //   if (this.searchFlowFormGroup.invalid == false) {
  //     let formdata = this.searchFlowFormGroup.value;
  //     let data = {
  //       page:
  //         this.paginationData !== undefined
  //           ? this.paginationData.pageIndex
  //           : "0",
  //       pageSize:
  //         this.paginationData !== undefined
  //           ? this.paginationData.pageSize
  //           : "10",
  //       order: {
  //         column: "modifiedTime",
  //         dir: "desc"
  //       },
  //       keySearch: formdata.searchVal,
  //       fieldSearch: [
  //         {
  //           fieldName: "flowId",
  //           fieldValue: formdata.flowId
  //         },
  //         {
  //           fieldName: "flowName",
  //           fieldValue: formdata.flowName
  //         },
  //         {
  //           fieldName: "fromDate",
  //           fieldValue:
  //             formdata.fromDate != ""
  //               ? moment(formdata.fromDate).format("YYYY-MM-DD")
  //               : ""
  //         },
  //         {
  //           fieldName: "toDate",
  //           fieldValue:
  //             formdata.endDate != ""
  //               ? moment(formdata.endDate).format("YYYY-MM-DD")
  //               : ""
  //         },
  //         {
  //           fieldName: "kioskType",
  //           fieldValue: "YES"
  //         }
  //       ]
  //     };
  //     this.https
  //       .postJson(
  //         environment.APIEndpoint + "api/rpa/feedback/flow/v1/search",
  //         data
  //       )
  //       .subscribe(
  //         res => {
  //           this.resultsLength = res["totalCount"];
  //           this.dataSource = new MatTableDataSource(res["items"]);
  //           this.dataSource.sort = this.sort;
  //           this.buildFlag = true;
  //           if (this.flowList.length > 0) {
  //             for (let i of this.dataSource.data) {
  //               if (this.flowList.indexOf(i["flowId"]) > -1) {
  //                 this.selection.select(i);
  //               }
  //             }
  //           }
  //         },
  //         err => {
  //           console.log(err);
  //         }
  //       );
  //   }
  // }


  // new enhancement
  searchVal() {
    if (this.searchFlowFormGroup.invalid == false) {
      let formdata = this.searchFlowFormGroup.value;
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "oid",
          "dir": "desc"
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "brandOid",
            "fieldValue": this.kioskData.brandId
          },
          {
            "fieldName": "countryOid",
            "fieldValue": this.kioskData.countryId
          }
        ]

      };
      this.https
        .postJson(
          environment.APIEndpoint + "api/rpa/feedback/flow/v2/search",
          data
        )
        .subscribe(
          res => {
            this.resultsLength = res["totalCount"];
            this.dataSource = new MatTableDataSource(res["items"]);
            this.dataSource.sort = this.sort;
            this.buildFlag = true;
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    console.log(numSelected);
    return numSelected === numRows;
  }
  reset() {
    this.buildSearchForm();
    this.searchVal();
  }
}
// {
//   "flowOid":61,
//   "flowName":"hfdshf",
//   "startDate":"2019-05-25",
//   "endDate":"",
//   "startTime":"05:15:26",
//   "endTime":"05:15:20"

// },
