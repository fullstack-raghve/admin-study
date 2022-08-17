import {OnInit, ViewChild, Output,Input, Component, EventEmitter, Inject} from "@angular/core";
import {FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm} from "@angular/forms";
import { AbstractControl } from '@angular/forms';
import { HttpService } from "../../../services/http-service";
import { environment } from "../../../../environments/environment";
import {MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule} from "@angular/material";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { SnackBarComponent } from "../../../shared/components/snack-bar/snack-bar.component";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export function spaceValidator(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
      control.setValue('');
      return { required: true }
  }
  else {
      return null;
  }
  }

@Component({
  selector: "store-contact.component",
  templateUrl: "store-contact.component.html",
  styleUrls: ["store-contact.component.scss"]
})
export class storeContactDialog implements OnInit {
  //ViewChild('createContact')createContactForm;

  contactFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public contactLocales = [];
  public contactDetails = {};
  public showContactError = false;
  public minLengthError = false;
  public alignCss = [];
  languageDirection = [];

  constructor(
    private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<storeContactDialog>
  ) {
    dialogRef.disableClose = true;
    this.buildContactForm();
  }

  ngOnInit() {
    this.contactLocale();
  }

  public buildContactForm() {
    let form = {
      contactLocale: this.fb.array([]),
      personNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
           Validators.pattern("^[0-9]*")
        ])
      ],
      personMailId: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(7),
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$")
        ])
      ],
      employeeId:["",Validators.compose([Validators.required,Validators.pattern("^[A-Za-z0-9]{1,20}$")])]
    };
    this.contactFormGroup = this.fb.group(form);
  }
  public contactLocale() {
    const control = <FormArray>this.contactFormGroup.controls["contactLocale"];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        name: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(2),
            Validators.pattern("^^[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF ]*"),
            spaceValidator
          ])
        ]
      });

      control.push(arr);
      this.alignCss.push(ln.direction == "RTL" ? "text-right" : "");
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
    }
  }
  // addContactValue(code) {
  //     var key = code;
  //     return this.fb.group({
  //     [key]: ['',Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z\u0600-\u06FF ]*')])]
  //       });
  // }
  createContact(formData) {
    if (this.contactFormGroup.invalid) {
    } else {
      formData.contactLocale.forEach((contact, index) => {
        this.contactLocales.push({
          contactPersonName: contact.name,
          languageOid: this.languageList[index].languageId
        });
      });
    
      if (this.contactLocales.length == 0) {
        this.showContactError = true;
      }
      this.contactDetails = {
        contactDetailLocales: this.contactLocales,
        phoneNumber: formData.personNumber,
        emailId: formData.personMailId,
        employeeId:formData.employeeId
      };
      this.dialogRef.componentInstance.contactDetails = this.contactDetails;
      this.dialogRef.close(this.contactDetails);
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
