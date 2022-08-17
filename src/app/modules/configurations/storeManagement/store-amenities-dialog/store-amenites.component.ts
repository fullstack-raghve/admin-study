import {OnInit, ViewChild, Output,Input, Component, EventEmitter, Inject} from "@angular/core";
import {FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm} from "@angular/forms";
import {MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule} from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { SnackBarComponent } from "../../../../shared/components/snack-bar/snack-bar.component";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';


@Component({
  selector: "store-amenities.component",
  templateUrl: "store-amenities.component.html",
  styleUrls: ["store-amenities.component.scss"]
})
export class storeAmenitiesDialog implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public aminityList=[];
  public selectedAminity=[];
  aminityFormGroup: FormGroup;
  public filePathUrl=localStorage.getItem("imgBaseUrl");
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<storeAmenitiesDialog>,private http:HttpService,
  ) {
    this.aminityFormGroup = this.fb.group({
      orders: this.fb.array([])
    });
    dialogRef.disableClose = true;
   
  }

  private addCheckboxes() {
    for(let i=0;i<this.aminityList.length;i++){
                  const control = <FormArray>this.aminityFormGroup.controls['orders'];
                  if(this.selectedAminity.length>0){
                    let value =false;
                    for (let j = 0; j < this.selectedAminity.length; j++) {
                      if(this.aminityList[i].amenityOid==this.selectedAminity[j].amenityOid){
                        value=true;
                      }
                    }
                    let newForm = this.fb.group({
                      amintyChecked:[value],
                    });
                    control.push(newForm);
                  }else{
                    let newForm = this.fb.group({
                      amintyChecked:[],
                    });
                    control.push(newForm);
                  }
              }
  }
  

  ngOnInit() {
      this.getAminites();
  }

  getAminites(){
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/amenity/v1/list";
    this.http.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
            this.aminityList = response;
            this.addCheckboxes();
        })
  }

  addAminity(value) {
  
    let area=[];
   for (let i = 0; i < this.aminityList.length; i++) {
      if(value.orders[i].amintyChecked){
        area.push(this.aminityList[i])
      }
   }
   this.dialogRef.close(area);
  }

  onCloseClick() {
    this.dialogRef.close(this.selectedAminity);
  }
}
