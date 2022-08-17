import {
  OnInit,
  ViewChild,
  Output,
  Input,
  Component,
  EventEmitter,
  Inject
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormGroupDirective,
  FormArray,
  NgForm
} from "@angular/forms";
import { HttpService } from "../../../services/http-service";
import { environment } from "../../../../environments/environment";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSlideToggleModule
} from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { SnackBarComponent } from "../../../shared/components/snack-bar/snack-bar.component";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "add-beacons.component",
  templateUrl: "add-beacons.component.html",
  styleUrls: ["add-beacons.component.scss"]
})
export class addBeaconsDialog implements OnInit {
  @Input("storeId") storeId;
  beaconsFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<addBeaconsDialog>
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.buildBeaconForm();
  }
  buildBeaconForm() {
    let form = {
      beaconName: [
        "",
        Validators.compose([
          Validators.required])
      ],
      beaconCode: [
        "",
        Validators.compose([
          Validators.required
        ])
      ],
      major: [
        "",
        Validators.compose([
          Validators.required])
      ],
      minor: [
        "",
        Validators.compose([
          Validators.required])
      ],
      description: ["",]
    };
    this.beaconsFormGroup = this.fb.group(form);
  }
  createBeacon(formData) {
    if (this.beaconsFormGroup.invalid) {
    } else {
      let request = {
        storeOid: parseInt(this.storeId),
        beaconName: formData.beaconName,
        beaconCode: formData.beaconCode,
        majorId: formData.major,
        minorId: formData.minor,
        description: formData.description,
        status: "ONLINE"
      };
      let CREATE_BEACONS =
        environment.APIEndpoint + "api/rpa/store/v1/beacon/create";
      this.https.postJson(CREATE_BEACONS, request).subscribe(
        response => {
          this.dialogRef.close();
        },
        err => {
          if (err.error.errorType == "VALIDATION") {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.errorDetails[0].description
              }
            });
          } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message:
                  "Your request cannot be saved at this time. Please try again later"
              }
            });
          }
        }
      );
    }
  }
  onCloseClick() {
    this.dialogRef.close();
  }
}
