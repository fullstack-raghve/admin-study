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
import { UploadFile } from '../../../services/uploadFile.service'

export interface UserData {
  sku: string;
  productName: string;
  category: string;
  price: string;
}

@Component({
    selector: 'products-dialog.component',
    templateUrl: 'products-dialog.component.html',
    styleUrls: ['products-dialog.component.scss']
  })


  export class productsDialog implements OnInit {
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
      @Input('productList')productList = [];
      @Input('excludeToggle')excludeToggle:boolean = false;
      @Input('toggleType')toggleType:boolean = false;
      dataSource: MatTableDataSource<object>;
      displayedColumns: string[] = ['select', 'sku', 'productName', 'category', 'price'];

      public moduleName="program";
      public status = true;
      public ruleList = [];
      public searchProductForm: FormGroup;
      public paginationData;
      public Obj;
      public resultsLength = 0;
      productType = "";
      buildFlag = false;
      public validateSkuFile=true;
      public CategoriesList = [];
      public uploadSkuCondition = false;
      public skuFile='';
      public productCheck:boolean = false;
      public selection = new SelectionModel(true, []);
      public statusValue: string = 'Include SKU';
      public skuIncExc:boolean=false;
      public scrollbarOptions;
      public toggleVal=true;
      public errorFilePath="";
      public errorFileName="";
      public programOid:number=0;
      public seletedTabIndex=0;
     // public checked = true;
      public errorFilePathUrl = localStorage.getItem("fileBaseUrl");

      constructor(private fb: FormBuilder,
        private https: HttpService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<MatDialog>,
        public snackBar: MatSnackBar,
        private uploadFile: UploadFile,
        private http:HttpService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            dialogRef.disableClose = true;
            this.productFormBuild();
          //  this.getProductcategoriesList();
          //this.searchVal();
        }

        ngOnInit() {
            
            this.checkProductList();
            this.dataSource = new MatTableDataSource();
            this.dataSource.paginator = this.paginator;
            this.searchVal();
          }


        openFilter() {
        this.status = !this.status;
        }

        public productFormBuild(){
            let form ={
              searchVal:[""],
              sku:[""],
              //productName:[""],
             // CategoryName:[""],
            }
            this.searchProductForm = this.fb.group(form);
        }

        paginationDetail = new BehaviorSubject(
            {
            length: 10,
            pageIndex: 0,
            pageSize: 10
            });

        isAllSelected() {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }


        masterToggle() {
             this.isAllSelected() ?
             this.selection.clear() :
             this.dataSource.data.forEach(row => this.selection.select(row));
            }


        onCloseClick(){
            let obj = {
                'buttonName': 'CANCEL',
                'tableData': this.selection.selected,
                'totalCount': this.resultsLength
              }
              this.dialogRef.close(obj); 
            // this.dialogRef.close();
        }

        public toggleStatus(event){
            if(event.checked){
                this.statusValue='Exclude SKU';
                this.skuIncExc=true;
            }else{
                 this.statusValue='Include SKU';
                 this.skuIncExc=false;
            }

        }


        searchVal() {
     //       this.toggleVal = this.excludeToggle;
            if (this.searchProductForm.invalid == false && this.programOid > 0){
                let formdata =  this.searchProductForm.value;
                let exclusive = "";
                if(formdata.isExclusive != ""){
                exclusive = formdata.isExclusive == true ? "1" : "0"
                }
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
                      column: "oid",
                    dir: "desc"
                  },
                  keySearch: formdata.searchVal,
                  fieldSearch: [
                    {
                      fieldName: "skuCode",
                      fieldValue: formdata.sku
                    },
                    {
                      fieldName: "program.oid",
                      fieldValue: this.programOid > 0 ? this.programOid : ''
                    }
                  ]
                };

                let SEARCH_PRODUCT ="api/rpa/loyalty/program/v1/get/skuList"
                this.https.postJson(environment.APIEndpoint + SEARCH_PRODUCT, data).subscribe(res => {
                    this.resultsLength = res["totalCount"];
                    this.dataSource = new MatTableDataSource(res["items"]);
                    if(this.productList!=undefined){
                        if(this.productList.length > 0){
                            for(let i of this.dataSource.data){
                                if(this.productList.indexOf(i["skuCode"]) > -1){
                                  this.selection.select(i);
                                }
                            }
                          }
                    }
                    this.dataSource.sort = this.sort;
                    this.buildFlag = true;
                }, err => {
                })
            }
        }


      public reset(){
          this.productFormBuild();
          this.searchVal();
      }

      getUpdate(event) {
        this.paginationDetail.next(event);
        this.paginationData = event;
        this.searchVal();
    }



    uploadSkuFile(event: FileList){
        if(event[0].type=="application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            this.uploadFile.upload(event.item(0), this.moduleName, 'files')
            .subscribe((response) => {
                this.skuFile = response['message'];
                this.errorFilePath="";
                this.validateSku();
            },err => {
                if(err.error.errorType=='VALIDATION'){
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: err.error.errorDetails[0].description
                        }
                    });
                }

            });
        }else{
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Supported format is xls and xlsx"
                }
            });

        }

    }

    validateSku(){
        let VALIDATE_SKU_FILE = environment.APIEndpoint + "api/rpa/loyalty/program/v1/skufile/validate";
        let request = {
            filePath: this.skuFile,
            moduleName:this.moduleName
        }
        this.http.postJson(VALIDATE_SKU_FILE, request)
        .subscribe((response) => {
            this.validateSkuFile = false;
        },err => {
            if(err.error.errorType=='VALIDATION'){
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "failure",
                        message: err.error.errorDetails[0].description
                    }
                });
            }
            this.errorFilePath=this.errorFilePathUrl+'/'+err.error.errorDetails[0].errorFilePath;
            this.errorFileName=this.errorFilePath.split('/').pop();
            this.validateSkuFile = true;
            this.skuFile="";
        })
    }


    getProductcategoriesList() {
        let GET_ALL_PARENTS = environment.APIEndpoint + "api/rpa/productcategory/v1/get/list";
        this.https.getJson(GET_ALL_PARENTS)
            .subscribe((response) => {
                this.CategoriesList = response;
            })
      }

      checkSkuFile(){
          if(this.skuFile == ''){
            this.uploadSkuCondition = true;
          }
      }
      checkProductList():boolean{
         if(this.selection.selected.length != 0){
            this.productCheck = true;
            return this.productCheck;
         }else{
            this.productCheck = false;
            return this.productCheck;
         }
      }
  }
