import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { HttpService } from '../../../../../services/http-service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-view-gift-card-product-dialog',
  templateUrl: './view-gift-card-product-dialog.component.html',
  styleUrls: ['./view-gift-card-product-dialog.component.scss']
})
export class ViewGiftCardProductDialogComponent implements OnInit {
  dataSourceAll;
  idValue=[];
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('selectedProductIdVal') selectedProductIdVal;
  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    private http: HttpService,
   
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    console.log(this.selectedProductIdVal);
  }

  onCloseClick(){
    this.dialogRef.close();
  }

}
