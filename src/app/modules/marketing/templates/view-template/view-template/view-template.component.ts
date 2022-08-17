import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent ,MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class ViewTemplateComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Templates',
    link: '/search-template'
  }
  ];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public href;
  public toggleVal;
  public disabled: boolean = true;
  public viewTemplateData;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  languageDirection = [];

  public genratedTemplate: SafeResourceUrl;
  

  constructor(
    private router: Router,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private sanitizer: DomSanitizer 
  ) { }

  ngOnInit() {
    // this.getViewData();
    let data = localStorage.getItem('TemplateViewID');
    if(data){
      this.href=data;
      this.getViewData();
      localStorage.removeItem('TemplateViewID');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-template'])
    }


  }

  getViewData() {
    // this.href = this.router.url.split('view-template/')[1];
    let data = {
      "templateId": this.href
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/marketing/template/v1/view', data).subscribe(res => {
      this.viewTemplateData = res;
      this.toggleVal = res["status"] == "ONLINE" ? true : false
      console.log(this.viewTemplateData);
      for(let ln of this.languageList){
        // this.alignCss.push(ln.direction == 'RTL' ? 'direction' : '');
        // this.langfield.push(ln.direction == 'RTL' ? 'direction' : '');
        this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
      }
      this.genratedTemplate = this.sanitizer.bypassSecurityTrustHtml(this.viewTemplateData.marketingTemplateLocales[0].content);
    }, err => {
      console.log(err);
    })
  }
  MoveToEdit(ID,type){
    let data=ID+'-'+type;
    localStorage.setItem('TemplateEditID',data);
    this.router.navigate(['/edit-template'])
  }

}
