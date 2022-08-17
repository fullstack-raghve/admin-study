import {OnInit, ViewChild, Output,Input, Component, EventEmitter, Inject} from "@angular/core";
import {FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm} from "@angular/forms";
import { HttpService } from "../../../services/http-service";
import { environment } from "../../../../environments/environment";
import {MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule} from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { SnackBarComponent } from "../../../shared/components/snack-bar/snack-bar.component";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "edit-store-contact.component",
  templateUrl: "edit-store-contact.component.html",
  styleUrls: ["edit-store-contact.component.scss"]
})
export class EditStoreContactDialog implements OnInit {
  //ViewChild('createContact')createContactForm;

  contactFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public contactLocales = [];
  public contactDetails = {};
  public showContactError = false;
  public minLengthError = false;
  public alignCss = [];
  @Input('personContactDetails') personContactDetails;
  @Input('personPhoneNumber') personPhoneNumber;
  @Input('personEmployeeId') personEmployeeId;
  @Input('personEmailId') personEmailId;
  @Input('personName') personName = [];
  @Input('editIndex') editIndex;
  languageDirection = [];
  
  // personalDetails = [];
  
  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EditStoreContactDialog>
  ) {
    dialogRef.disableClose = true;
    this.buildContactForm();
    console.log(this.editIndex);
  }

  ngOnInit() {
    this.contactLocale();
    this.populatedata();
    console.log(this.personEmployeeId);
    console.log(this.personPhoneNumber);
    console.log(this.personEmailId);
  }

  public buildContactForm() {
    let form = {
      contactLocale: this.fb.array([]),
      personNumber: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
           Validators.pattern("^[0-9]*")
        ])
      ],
      personMailId: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(7),
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
        ])
      ],
      employeeId:['',Validators.compose([Validators.required,Validators.pattern("^[A-Za-z0-9]{1,20}$")])]
    };
    this.contactFormGroup = this.fb.group(form);

  }

  populatedata() {
    this.contactFormGroup.patchValue({
      personNumber : this.personPhoneNumber,
      personMailId : this.personEmailId,
      employeeId : this.personEmployeeId,
    });
    console.log(this.contactFormGroup)
  }

 
  public contactLocale() {
    const control = <FormArray>this.contactFormGroup.controls["contactLocale"];
    for (let ln of this.personName) {
      let arr = this.fb.group({
        name: [
            ln.contactPersonName,
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.pattern("[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF ]*")
          ])
        ]
      });
      this.alignCss.push(ln.languageDirection == "RTL" ? "text-right" : "");
      this.languageDirection.push(ln.languageDirection == 'RTL' ? 'direction' : '');
      control.push(arr);

    }
  }

  createContact(formData) {
    if (this.contactFormGroup.invalid) {
    } else {
      formData.contactLocale.forEach((contact, index,editIndex) => {
        this.contactLocales.push({
          languageOid: this.languageList[index].languageId,
          languageCode:this.languageList[index].languageCode,
          languageName:this.languageList[index].languageName,
          languageDirection:this.languageList[index].languageDirection,
          contactPersonName: contact.name,
        });
      })
    
      if (this.contactLocales.length == 0) {
        this.showContactError = true;
      }

      let personalDetails = {
        phoneNumber: formData.personNumber,
        emailId: formData.personMailId,
        employeeId:formData.employeeId,
        editIndex : this.editIndex,
        contactDetailLocales: this.contactLocales,
      };
      this.dialogRef.close(personalDetails);
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
