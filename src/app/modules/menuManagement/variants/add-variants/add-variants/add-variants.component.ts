import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { count } from 'rxjs/operators';

@Component({
  selector: 'add-variants',
  templateUrl: './add-variants.component.html',
  styleUrls: ['./add-variants.component.scss']
})
export class AddVariantsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Variants',
    link: '/add-variants'
  }
  ];

  @ViewChild(MatTable) table: MatTable<any>;
  variantFormGroup: FormGroup;
  public statusValue: string = 'ONLINE';
  public toggleVal = true;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public loading: boolean = false;
  public variant_locale: any = [];
  public variant_locales: any = [];
  public variant_types: any = [];
  public showError: boolean = false;
  public errorMsg:any = [];
  languageDirection = [];

  displayedColumns = [];
  public data = []

  dataSource = this.data;

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public snackBar: MatSnackBar, ) {
    this.languageList.forEach(lang => {
      this.displayedColumns.push(lang.languageName);
    });
    this.displayedColumns.push('delete');
    this.buildCreateVariantForm();
  }

  ngOnInit() {
    this.variantTypeLocaleForm();
  }

  public buildCreateVariantForm() {
    let form = {
      variantTypeLocale: this.fb.array([]),
      variantName: ["", Validators.compose([Validators.required])],
    }
    this.variantFormGroup = this.fb.group(form);
  }

  public variantTypeLocaleForm() {
    console.log("size = " + this.languageList.length);
    const control = <FormArray>this.variantFormGroup.controls['variantTypeLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        variantType: [''],
      });
      control.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
    }
  }

  public showVariantError = [];
  public addVariantType() {
    let controll = this.variantFormGroup.get('variantTypeLocale') as FormArray;
    let array = [];
    for (var i = 0; i < this.languageList.length; i++) {
      this.showVariantError[i] = false;
      let variantType = controll.at(i).get('variantType');
      let languageOid = this.languageList[i].languageId;

      if (null == variantType.value || variantType.value == '') {
        this.showVariantError[i] = true;
        this.errorMsg[i] = "Please enter a value";
      } else {
        for (var j = 0; j < this.dataSource.length; j++) {
          for (var k = 0; k < this.dataSource[j].length; k++) {
            let data = this.dataSource[j][k];
            if (data.languageOid == languageOid && data.variantType == variantType.value) {
              this.showVariantError[i] = true;
              this.errorMsg[i] = "Entered variant type is duplicate";
            }
          }
        }
      }
      if (this.showVariantError[i] == false) {
        array.push({
          "languageOid": this.languageList[i].languageId,
          "variantType": controll.at(i).get('variantType').value
        })
        variantType.setValue("");
      }
    }
    if (array.length == this.languageList.length) {
      this.dataSource.push(array);
      this.table.renderRows();
    }
  }

  createVariant(formData) {
    this.variant_locale = [];
    this.variant_types = [];
    this.variant_locales = [];
    if (this.variantFormGroup.invalid) {
      this.showError = true;
    }
    else {
      this.loading = true;
      this.showError = false;
      console.log(this.dataSource);

      for (let i = 0; i < this.dataSource.length; i++) {
        this.variant_types.push({
          variantTypeLocales: this.dataSource[i]
        })
      }

      let createVariantRequest = {
        variantName: formData.variantName,
        variantTypes: this.variant_types,
        status: this.statusValue,
      }
      let CREATE_VARIANTS = environment.APIEndpoint + "api/rpa/menu/variant/v1/create";
      this.http.postJson(CREATE_VARIANTS, createVariantRequest)
        .subscribe((response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Variant added successfully"
            }
          });
          this.loading = false;
          this.router.navigate(['/search-variants']);
        }
          , (err) => {
            this.loading = false;
            console.log("error Status = " + err);
            if (err.error.errorType == 'VALIDATION') {
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
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          })
    }
  }


  delete(row: any): void {
    const index = this.dataSource.indexOf(row, 0);
    if (index > -1) {
      this.dataSource.splice(index, 1);
    }
    this.table.renderRows();
  }



  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }

}
