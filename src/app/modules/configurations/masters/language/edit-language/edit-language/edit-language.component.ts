import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.scss']
})
export class EditLanguageComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Language',
          link: '/search-country'
      }
    ];
    @ViewChild("editLanguageForm") editLanguageForm;
    languageFormGroup: FormGroup;
    public showLanguageError: boolean = false;
    public loading: boolean = false;
    public showError: boolean = false;
    public languageId;
    public languageData: any = [];
    public statusValue: string;
    public arr: any = [];
    public buildFlag: boolean = false;
    public toggleVal:boolean=false;

    public href;
    public editLanguageData;
    public totalCount;
    constructor(private fb: FormBuilder,
      private router: Router,
      private https: HttpService,
      public snackBar: MatSnackBar,
  private activatedRoute: ActivatedRoute) {
          // this.activatedRoute.params.subscribe((params) => {
          //       this.languageId = params.id;

          //   });
      this.buildEditLanguageForm();
    }

    ngOnInit() {
      // this.getViewData();
      let data = localStorage.getItem('LanguageEditID');
      if(data){
        this.languageId = data;
        this.getViewData();
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-language'])
      }
    }
    populatedata() {

      this.languageFormGroup.patchValue({
          langCode : this.editLanguageData.langCode,
          langName : this.editLanguageData.langName,
           direction : this.editLanguageData.direction,
      })


    }
    getViewData() {
      this.href = this.router.url.split('edit-language/')[1];
      let data = {
        languageId: this.languageId
      }
      this.https.postJson(environment.APIEndpoint + 'api/rpa/master/language/v1/view', data).subscribe(res => {
        this.editLanguageData = res;
        this.buildEditLanguageForm();
        this.populatedata();
        console.log(this.editLanguageData);
      }, err => {
        console.log(err);
      })
    }
    public updateLanguage(formData){
      if(this.languageFormGroup.valid==false){
        return
      }
      let updatedData =  {
        languageId:this.languageId,
        langName : formData.langName,
        direction : formData.direction,
        status: 'ONLINE'


      }

      this.https.postJson(environment.APIEndpoint+ "api/rpa/master/language/v1/update" , updatedData).subscribe(response => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Language master has been updated successfully"
          }
        });
        sessionStorage.clear();
        this.router.navigate(['/search-language']);
      }, err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Language master not updated"
          }
        });
      })

    }
    public buildEditLanguageForm() {
      const form = {
        langCode: ['', Validators.compose([Validators.required])],
        langName: ['', Validators.compose([Validators.required])],
        direction: ['', Validators.compose([Validators.required])],
      };
      this.languageFormGroup = this.fb.group(form);
    }

   }
