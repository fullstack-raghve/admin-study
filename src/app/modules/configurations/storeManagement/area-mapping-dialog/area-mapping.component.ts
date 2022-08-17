import {OnInit, ViewChild, Output,Input, Component, EventEmitter, Inject} from "@angular/core";
import {FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatTableDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { SnackBarComponent } from "../../../../shared/components/snack-bar/snack-bar.component";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: "area-mapping.component",
  templateUrl: "area-mapping.component.html",
  styleUrls: ["area-mapping.component.scss"]
})
export class AreaMappingDialog implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public deliveryArea=[];
  deliveryFormGroup: FormGroup;
  public selectedArea=[];
  orders = [];
  public selectAll:boolean=false;
  public loadingResponse: boolean = false;
 resultsLength: any;
 public dataSource;
 cityList = [];
  countries=[];
  brandID;
  countryId;
  cityID;
  displayedColumns: string[] = [ 'deliveryAreaOid','countryName' ,'cityName','areaName'];
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AreaMappingDialog>,private http:HttpService
  ) {
    this.deliveryFormGroup = this.formBuilder.group({
      countryId:'',
      cityID: ''
    });
    // async orders
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    // this.getDeliveryArea();
    this.getAllData()
    // this.getAllCitiesA1(this.countryId) 
    
    // this.dataSource = new MatTableDataSource<any>;

  }
 
  getAllData(){
    this.loadingResponse = true;

    let CityID=[];
    if(this.cityID != '' ){
      CityID.push(this.cityID)
    }
    let URL = environment.APIEndpoint+ "api/rpa/store/deliveryArea/v1/areaListByCountryCityOid";
    let data = {
      "countryOid":  this.countryId,
      "cityOids": this.cityID
    }
    this.http.postJson(URL,data)
    .subscribe((response) => {
     console.log(response)
     this.loadingResponse = false;
     this.deliveryArea = response;
     this.dataSource = new MatTableDataSource(this.deliveryArea)
     if (this.deliveryArea.length > 0) {
      this.NoRecord= false;
   for (let ij of this.deliveryArea) {

     for (let jk of this.selectedArea) {
         
       if(jk['deliveryAreaOid'] == ij['deliveryAreaOid'] ){
         this.selection.select(ij);
         }
       }
       }
     } else {
      this.NoRecord= true;
     }
}, err => {
this.loadingResponse = false;
   console.log(err)
})  
  }
 
  // getDeliveryArea(){
  //   this.loadingResponse = true;
  //   let GET_DELIVERY_AREA = environment.APIEndpoint + "api/rpa/store/deliveryArea/v1/list";
  //   this.http.getJson(GET_DELIVERY_AREA)
  //       .subscribe((response) => {
  //         console.log(response)
  //         this.loadingResponse = false;
  //           this.deliveryArea = response;
  //           this.dataSource = new MatTableDataSource(this.deliveryArea)
  //           if (this.deliveryArea.length > 0) {
  //             // for (const i of this.dataSource.data) {
  //             //   if (this.selectedArea.indexOf(i['deliveryAreaOid']) > -1) {
  //             //     this.selection.select(i);
  //             //   }
  //             // }

  //         for (let ij of this.deliveryArea) {

  //           for (let jk of this.selectedArea) {
                
  //             if(jk['deliveryAreaOid'] == ij['deliveryAreaOid'] ){
  //               this.selection.select(ij);
  //               }
  //             }
  //             }
  //           } else if (this.selectAll) {
  //             for (const i of this.dataSource.data) {
  //               console.log(i);
  //                 this.selection.select(i);
  //             }
  //           }
  //   }, err => {
  //     this.loadingResponse = false;
  //         console.log(err)
       
  //   })
  // }
  // private addCheckboxes() {
  //   for(let i=0;i<this.deliveryArea.length;i++){
  //                 const control = <FormArray>this.deliveryFormGroup.controls['orders'];
  //                 if(this.selectedArea.length>0){
  //                   let value =false;
  //                   for (let j = 0; j < this.selectedArea.length; j++) {
  //                     if(this.deliveryArea[i].deliveryAreaOid==this.selectedArea[j].deliveryAreaOid){
  //                       value=true;
  //                     }
  //                   }
  //                   let newForm = this.formBuilder.group({
  //                     area:[value],
  //                   });
  //                   control.push(newForm);
  //                 }else{
  //                   let newForm = this.formBuilder.group({
  //                     area:[],
  //                   });
  //                   control.push(newForm);
  //                 }
  //             }
  // }


  // addDeliveryArea(value) {
  
  //   let area=[];
  //  for (let i = 0; i < this.deliveryArea.length; i++) {
  //     if(value.orders[i].area){
  //       area.push(this.deliveryArea[i])
  //     }
  //  }
  //  this.dialogRef.close(area);
  // }

  NoRecord= false;

  onCloseClick() {
    this.dialogRef.close({ event: 'Cancel' });
  }
  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData.length)
    if (this.dataSource.filteredData.length > 0) {
      this.NoRecord = false;
    } else {
      this.NoRecord = true;

    }
    }
  selection = new SelectionModel(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    console.log(numSelected);
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
