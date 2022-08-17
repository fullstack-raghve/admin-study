import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-enquiry-type',
  templateUrl: './view-enquiry-type.component.html',
  styleUrls: ['./view-enquiry-type.component.scss']
})
export class ViewEnquiryTypeComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Enquiry Type',
        link: '/search-enquiry-type'
    }
    ];

    public checked=false;
    public enquiryTypeId;
    public enquiryTypeData;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
      private http:HttpService,public snackBar: MatSnackBar) {
        // this.activatedRoute.params.subscribe((params) => {
        //       this.enquiryTypeId = params.id;
        //   });
      }

  ngOnInit() {
    // this.getEnquiryTypeById();
    let data=  localStorage.getItem('EnquiryViewID');
    if(data){
      this.enquiryTypeId=data;
      this.getEnquiryTypeById();
      localStorage.removeItem('EnquiryViewID');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-enquiry-type']);
    }
  }

  public getEnquiryTypeById(){
    let GET_ENQUIRY_TYPE_BY_ID = environment.APIEndpoint+"api/rpa/master/enquiry/type/v1/view";
    let request = {
      enquiryTypeId:this.enquiryTypeId
    }
    this.http.postJson(GET_ENQUIRY_TYPE_BY_ID,request)
    .subscribe((response) => {
            console.log(response);
            this.enquiryTypeData= response;
           for(let c of this.enquiryTypeData.enquiryTypeLocales){
               this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
           }
            this.checked = response['status']=='ONLINE'?true:false;

        }
        ,err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                }
            });
              console.log("error Status = "+err.status);

        })
}
MoveToEdit(ID){
  localStorage.setItem('EnquiryEditID',ID);
  this.router.navigate(['/edit-enquiry-type'])
}

}
