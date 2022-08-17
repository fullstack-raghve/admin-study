import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Program {
  programId: number;
  programName: string;
}

@Component({
    selector: 'add-rule.component',
    templateUrl: 'add-rule.component.html',
    styleUrls: ['add-rule.component.scss']
  })


  export class addRulesDialog implements OnInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatPaginator) paginator1: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
      @Input('ruleList')ruleList = [];
      dataSource: MatTableDataSource<object>;
      displayedColumns: string[] = ['select', 'ruleId', 'ruleName', 'actionType', 'action', 'rewardType'];
      dataSource1: MatTableDataSource<object>;
      displayedColumnsBurn: string[] = [ 'select', 'ruleId', 'ruleName', 'rewardType', 'redeemType', 'redeemQty'];
      public searchStoreForm: FormGroup;
      public paginationData;
      public ruleId;
      public resultsLength = 0;
      public resultsLength1 = 0;
      public programs: any = [];
      public earnRules: any = [];
      public burnRules: any = [];
      public programId : string;
      public ruleType:string;

      public brandList;
    Programs: Program[] = [];
    programCtrl = new FormControl();
    filteredprograms: Observable<Program[]>;

      constructor(private fb: FormBuilder,
        private https: HttpService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<MatDialog>,
        public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) data) {
            dialogRef.disableClose = true;
            this.dataSource = new MatTableDataSource();
            this.dataSource1 = new MatTableDataSource();

            if(data!=null){
                this.ruleId = data.ruleId;
                this.ruleType = data.dataKey;
               }


      }
      public selection = new SelectionModel(true, []);


      onCloseClick(): void {
        let obj ={
            'buttonName': 'CANCEL'
        }
        this.dialogRef.close(obj);
      }
      ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource1.paginator = this.paginator1;
        this.getPrograms();
      }

      resetForm() {
        this.searchStoreForm.reset()
      }

      getPrograms() {
    
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs";
        this.https.getJson(GET_ALL_ONLINE_BRANDS)
          .subscribe((response) => {
            this.brandList = response;
    
            for (let i = 0; i <= this.brandList.length - 1; i++) {
              let objMallkey = {
                programId: this.brandList[i]['programId'],
                programName: this.brandList[i]['programName'],
              }
              this.Programs.push(objMallkey);
            }
            this.filteredprograms = this.programCtrl.valueChanges
                .pipe(
                  startWith(''),
                  map(program => program ? this._filterBrands(program) : this.Programs.slice())
                );
          },
            (error) => {
            });
      }
      private _filterBrands(value: string): Program[] {
        const filterValue = value.toLowerCase();
        return this.Programs.filter(program => program.programName.toLowerCase().indexOf(filterValue) === 0);
      }
      public programID;
     



      onItemChange(selectedValue:string){
         this.programId = selectedValue;
        let GET_EARN_RULE_DATA_BY_ID = environment.APIEndpoint+"api/rpa/earnRule/v1/get/list?programId="+selectedValue;
        this.https.getJson(GET_EARN_RULE_DATA_BY_ID)
        .subscribe((response) => {
            this.dataSource.data = response;
            this.resultsLength = response.length;
         }
         ,err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                  status: "failure",
                  message: "Your request cannot be view at this time. Please try again later"
              }
          });
      })

      let GET_BURN_RULE_DATA_BY_ID = environment.APIEndpoint+"api/rpa/burn/rule/v1/program/view";
      let request = {
        programId : selectedValue,
        status : 'ONLINE'
      }
      this.https.postJson(GET_BURN_RULE_DATA_BY_ID, request)
        .subscribe((response) => {
            this.dataSource1.data = response;
            this.resultsLength1 = response.length;
         }
         ,err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                  status: "failure",
                  message: "Your request cannot be view at this time. Please try again later"
              }
          });
      });
      }

    status = true;
     openFilter() {
       this.status = !this.status;
     }

     isBurnRuleSelected(value: any): boolean {
        if (value.burnRuleId == this.ruleId )
          return true;
        else
          return false;
      }

      isEarnRuleSelected(value: any): boolean {
        if (value.earnRuleId == this.ruleId )
          return true;
        else
          return false;
      }
  }
