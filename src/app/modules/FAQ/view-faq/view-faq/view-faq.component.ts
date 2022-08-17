import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-faq',
  templateUrl: './view-faq.component.html',
  styleUrls: ['./view-faq.component.scss']
})
export class ViewFaqComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'FAQ',
      link: ''
      },
    ];

    @ViewChild("createFaqForm")createFaqForm;
    faqFormGroup:FormGroup;
    public toggleVal:boolean=false;
    checked = true;
    disabled = true;
    public href;
    public faqCategory;
    public faqLocales;
    public alignCss = [];
    public langfieldname = [];
    public faqData;

    constructor(private router: Router, private https:HttpService,
       public snackBar: MatSnackBar){
    }

    ngOnInit() {
      let data = localStorage.getItem('FaqViewId');
      if(data){
        this.href=Number(data);
        this.getViewFaqData();
        localStorage.removeItem('FaqViewId')
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-faq'])
      }
    }

    getViewFaqData(){
      // this.href = this.router.url.split('view-faq/')[1];
      let data={
        "faqId" : parseFloat(this.href)
      }
        this.https.postJson(environment.APIEndpoint+"api/rpa/faq/v1/view", data).subscribe(res=>{
          console.log('res', res);
                   this.faqData = res;
                   this.faqCategory=res["faqCategory"];
                   this.faqLocales=res["faqLocales"];
                  //  this.toggleVal = res["status"];
                  this.toggleVal = res["status"] == "ONLINE" ? true : false;
                   for(let i=0; i< this.faqLocales.length; i++){
                      this.alignCss.push(this.faqLocales[i].languageDirection == 'RTL' ? 'text-right' : '');
                      this.langfieldname.push(this.faqLocales[i].languageDirection == 'RTL' ? 'lang-field-right' : '');
                   }

        }, err=>{
          this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
              }
          });
        })
  }
  MoveToEdit(ID){
    localStorage.setItem('FAQEditId',ID);
    this.router.navigate(['/edit-faq']);
  }
}
