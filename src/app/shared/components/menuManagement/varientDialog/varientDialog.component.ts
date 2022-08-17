import { OnInit, ViewChild, Input, Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormArray } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
export interface storeListData {
    varientName: any,
    quantity: any,
    customAddOns: any
  }

@Component({
  selector: 'varientDialog',
  templateUrl: './varientDialog.component.html',
  styleUrls: ['./varientDialog.component.scss']
})

export class VarientDialogComponent  {
//   public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
//   dataSource: MatTableDataSource<object>;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select','varientName', 'quantity', 'customAddOns'];
  public paginationData;
  public status = true;
  public selectAll: boolean = false;
  resultsLength: any;
  public selection = new SelectionModel(true, []);
  public dataSource: MatTableDataSource<storeListData>;
  dataSourceAll: MatTableDataSource<storeListData>;
  storeList: storeListData[] = [  ];
  @Input('isDisabled') isDisabled: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalRecordVal: boolean;
  totalFilterRecordVal: boolean;
  noRecords: boolean;
  total: any;
  selectedArray: any[];
  selectedStoreCount: number;
  loadingResponse=true;
  popUPData;
  variantsFormGroup:FormGroup

  constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<VarientDialogComponent>,
  private dialog: MatDialog,
  private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private http: HttpService,
  public snackBar: MatSnackBar){
  }
 

  ngOnInit() {
    this.dataSource = new MatTableDataSource<storeListData>(this.storeList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.buildCreateVariantsForm() ;
    }
    public buildCreateVariantsForm() {
      this.variantsFormGroup = this.fb.group({
        productVariants: this.fb.array([])
      });
      this.productVariantsForm();
    }

    
    public productVariantsForm() {
      const control = <FormArray>this.variantsFormGroup.controls['productVariants'];
      for (let p = 0; p < this.popUPData.length; p++) {
        const newForm = this.fb.group({
          
          variantTypeName: [this.popUPData[p].variantTypeName],
        
          maxSelectionCustAddons:[this.popUPData[p].maxSelectionCustAddons,   Validators.compose([
            Validators.required,
            Validators.min(1)
          ])],
         
        });
        control.push(newForm);
      }
    }
   
   
  
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
  }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      this.selectedArray = this.selection.selected;
      this.selectedStoreCount = this.selectedArray.length;
      return numSelected === numRows;
  }


  onCloseClick(){
    this.dialogRef.close();
  }

  createQuantity(){
    if(this.variantsFormGroup.valid){
      let Obj={
        'buttonName': 'SELECT',
                'tableData': this.variantsFormGroup.value,
                'totalCount':this.resultsLength
      }
      this.dialogRef.close(Obj);
    }
  }


}