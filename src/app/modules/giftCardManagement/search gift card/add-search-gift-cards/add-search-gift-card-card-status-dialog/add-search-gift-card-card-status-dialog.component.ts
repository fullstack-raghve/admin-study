import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { SnackBarComponent } from '../../../../../../app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {

  // position: number;
  giftcardCodeId: number;
  secretCode: string;

}
const ELEMENT_DATA: PeriodicElement[] = []


@Component({
  selector: 'app-add-search-gift-card-card-status-dialog',
  templateUrl: './add-search-gift-card-card-status-dialog.component.html',
  styleUrls: ['./add-search-gift-card-card-status-dialog.component.scss']
})
export class AddSearchGiftCardCardStatusDialogComponent implements OnInit {
  displayedColumns: string[] = ['select', 'giftcardCodeId', 'secretCode',];
  dataSource: MatTableDataSource<PeriodicElement>;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  public selectedArray
  public resultsLength = 0;
  public noRecords: boolean = false;
  
  @Input('cardStatusArray') cardStatusArray: any = [];
  @Input ('storeList') storeList :any =[];
  @Input ('selectedData') selectedData :any =[];
  
  @Input('isDisabled') isDisabled: boolean = false;
  CardStatus: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,

    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;

  }
  ngOnInit() {
    console.log(this.storeList);
    
    console.log(this.cardStatusArray);
    this.getcardStatus();
     this.cardStatusArray[0]['status']
     console.log(this.cardStatusArray[0]['status']);
     this.CardStatus=this.cardStatusArray[0]['status']
     if (this.cardStatusArray.length==0) {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
console.log(numSelected)
    const numRows = this.dataSource.data.length;
    // console.log(numSelected);
    // console.log(this.selection.selected);
    this.selectedArray = this.selection.selected;
    console.log(this.selectedArray)
    return numSelected === numRows;
   // console.log(numSelected);

  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }

  }
  // displayedColumns: string[] = ['giftcardCodeId', 'secretCode', ];
  // dataSource: MatTableDataSource<PeriodicElement>;

  // dataSource = ELEMENT_DATA;


  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.selection.selected,
      'totalCount': this.resultsLength,
    }
    this.dialogRef.close(obj);

  }
  public selectAll: boolean = true 
  
  getcardStatus() {
    this.dataSource = new MatTableDataSource(this.cardStatusArray); 
    console.log(this.dataSource.data);
console.log(this.selectedData);
// selectedData SHould be there in place of storeList
    if (this.storeList.length > 0) {
      console.log(this.storeList.length);

      for (let i of this.dataSource.data) {
        if (this.storeList.indexOf(i['giftcardCodeId']) > -1) {
          this.storeList.select(i);
        }
      }
     
    } else if (this.selectAll) {
      for (let i of this.dataSource.data) {
        this.selection.select(i);
      }
    }
  }



}

