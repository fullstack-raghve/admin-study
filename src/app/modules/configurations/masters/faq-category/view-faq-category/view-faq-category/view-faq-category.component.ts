import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';


@Component({
  selector: 'app-view-faq-category',
  templateUrl: './view-faq-category.component.html',
  styleUrls: ['./view-faq-category.component.scss']
})
export class ViewFaqCategoryComponent implements OnInit {

    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'FAQ Category',
          link: '/search-country'
      }
    ];
    @ViewChild("viewFaqForm")viewFaqForm;
    faqFormGroup:FormGroup;
    public showError: boolean = false;
    public href;
    public viewFAQ;
    public toggleVal;
    //public filePathUrl = environment.APIEndpoint + 'img/';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public loading: boolean = false;
    public showCountryError:boolean = false;
    public statusValue:string = 'Offline';
    checked = true;
    disabled = true;
    public alignCss = [];

    constructor(private https:HttpService, private router: Router ,public snackBar: MatSnackBar){
        // this.getViewFaqData();
    }

    ngOnInit() {
      let data=    localStorage.getItem('FaqViewID');
      if(data){
        this.href = data;
        this.getViewFaqData();
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-faq-category']);
      }

    }
    getViewFaqData(){
        // this.href = this.router.url.split('view-faq-category/')[1];
        let data={
          "faqCategoryId" : this.href
        }
          this.https.postJson(environment.APIEndpoint+"api/rpa/faq/category/v1/view", data).subscribe(res=>{
                     this.viewFAQ=res["faqCategoryLocales"];
                     this.toggleVal = res["status"] == "ONLINE" ? true : false;
                     for(let i=0; i< this.viewFAQ.length; i++){
                        this.alignCss.push(this.viewFAQ[i].languageDirection == 'RTL' ? 'text-right' : '');
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
    public toggleStatus(event){
        if(event.checked==true){
            this.statusValue='Online';
        }else{
             this.statusValue='Offline';
        }

    }
    MoveToEdit(ID){
      localStorage.setItem('FaqEditID',ID);
      this.router.navigate(['/edit-faq-category'])
    }
}
