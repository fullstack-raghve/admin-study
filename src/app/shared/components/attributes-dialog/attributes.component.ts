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


@Component({
  selector: 'attributes.component',
  templateUrl: 'attributes.component.html',
  styleUrls: ['attributes.component.scss']
})


export class addAttributesDialog implements OnInit {
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  @Input('campaignActivitySelection') campaignActivitySelection;
  @Input('couponDataValue') couponDataValue = [];
  reqattributeValue;
  selectedBrand: any;
  selectedBrandIdName: any;
  brandDisplay: any;
  selectedBrandId: string;
  brandMandatory: boolean = false;
  showErrorMessage: boolean = false;
  constructor(
    private https: HttpService,
    public dialog: MatDialog,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;

  }

  public personalizeData;
  public attrName;
  public selected;
  public checked;
  public list;
  public specificBrands = [];

  ngOnInit() {
    console.log(this.campaignActivitySelection);
    console.log(this.couponDataValue);
    if (this.couponDataValue.length != 0) {
      this.reqattributeValue = 'Other with coupon';
    } else {
      this.reqattributeValue = this.campaignActivitySelection;
    }
    this.getData();
    this.getAllRegionBrands();
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  dataChanged(y) {
    this.selected = JSON.parse(y);
    this.selected.attributeTitleList.map(e => {
      e.checked = false;
    })

  }

  toggleVisibility(x,e) {
    console.log(x);
    if(x.checked == true){
   if(x.name == "Brand Point Balance (GCC)" || x.name == "Brand Points Worth (India)" || x.name == "Brand Points Worth (GCC)" || x.name == "Brand Point Balance (India)"){
    this.brandDisplay = true;
    if(this.selectedBrand == undefined){
      this.showErrorMessage = true;
    }else{
      this.showErrorMessage = false;
    }
     console.log(this.brandDisplay);
    }
   }else{
    this.brandDisplay = false;
    // this.brandMandatory = false;
   }

  }

  createList() {
    for(let i = 0;i< this.specificBrands.length;i++){
      if(this.selectedBrand == this.specificBrands[i].brandId){
        this.selectedBrandIdName = '{' + 'brand' +'_' + this.selectedBrand + '}';
        this.selectedBrandId = 'brand' +'_' + this.selectedBrand;
        console.log(this.selectedBrandIdName);
      }
    } 

    this.list = this.selected.attributeTitleList.filter(e => {
      return e.checked == true
    })
    if(this.selectedBrand == undefined){
      this.dialogRef.close(this.list);
      this.brandMandatory = false;
    }
  else{
    if(this.showErrorMessage == false){
      this.brandMandatory = true;
      this.dialogRef.close({
        'list': this.list,
        'brand': this.selectedBrandIdName,
        'brandId': this.selectedBrandId
      });
    }
  }
  }

  getAllRegionBrands(){
    let GET_ALL_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.http.getJson(GET_ALL_BRANDS)
        .subscribe((response) => {
            this.specificBrands = response;
        }),
        (error)=>{
            console.log(error);
            
        }
}

  getData() {
    let GET_ATTRIBUTES = environment.APIEndpoint + "api/rpa/personalize/attribute/v1/list";
    this.https.getJson(GET_ATTRIBUTES + "?actionName=" + this.reqattributeValue).subscribe(res => {
      console.log(res);
      this.personalizeData = res;
      console.log(res);
      this.attrName = res[0];
      this.selected = this.attrName;
      console.log(this.selected);
      this.selected.attributeTitleList.map(e => {
        e.checked = false;
      });

    }, err => {
      console.log(err);
    })

  }

  selectChange(value){
this.selectedBrand = value;
if(this.selectedBrand != undefined){
  this.showErrorMessage = false;
}
  }

}
