import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'view-about-us',
  templateUrl: './view-about-us.component.html',
  styleUrls: ['./view-about-us.component.scss']
})
export class ViewAboutUsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'About Us',
    link: ''
  },
  ];

  aboutUsFormGroup: FormGroup;
  public toggleVal;
  public checked;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  // public filePathUrl2 = localStorage.getItem("imgBaseUrl");
  public loading: boolean = false;
  public showCountryError: boolean = false;
  public id;
  public viewData = [];
  public text = [];

  constructor(private fb: FormBuilder, private https: HttpService,
    private router: Router, public snackBar: MatSnackBar, private sanitized: DomSanitizer) {

  }

  ngOnInit() {
    let data = localStorage.getItem('viewAboutUsId');
    if(data){
      this.id=Number(data);
      this.getViewFaqData();
      localStorage.removeItem('viewAboutUsId')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-about-us'])
    }
  }

  getViewFaqData() {
    // this.id = this.router.url.split('view-about-us/')[1];
    let data = {
      "aboutUsId": parseFloat(this.id)
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/aboutus/v1/view", data).subscribe(res => {
      this.viewData = res;
      this.toggleVal = res["status"];
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.getText(this.viewData);

    })
  }
  public getText(viewData) {
    for (var i = 0; i < viewData.aboutUsLocales.length; i++) {
      this.text.push(this.sanitized.bypassSecurityTrustHtml(viewData.aboutUsLocales[i].content));
    }
  }

  public buildViewFaqForm() {
    let form = {
      faqTitle: ["", Validators.required],
      status: [false],
    }
    this.aboutUsFormGroup = this.fb.group(form);
  }
  MoveToEdit(ID, type){
      let data =  ID+'-'+type
    localStorage.setItem('AboutUsEditId',data);
    this.router.navigate(['/edit-about-us']);
  }
}
