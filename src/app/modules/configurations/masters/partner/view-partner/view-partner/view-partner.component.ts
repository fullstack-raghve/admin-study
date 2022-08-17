import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';


@Component({
  selector: 'view-partner',
  templateUrl: './view-partner.component.html',
  styleUrls: ['./view-partner.component.scss']
})
export class ViewPartnerComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Partner',
        link: '/search-partner'
    }
    ];

    public checked=false;
    public partnerId;
    public partnerData;
    public alignCss=[];
    
  constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private http:HttpService,public snackBar: MatSnackBar) {
      // this.activatedRoute.params.subscribe(
      //   (param) => {
      //     this.partnerId = param.id;
      //   } 
      // );
     }

  ngOnInit() {
  // this.getPartner();
  let data=localStorage.getItem('PartnerViewID');
  if(data){
    this.partnerId=data;
    this.getPartner();
  }else{
    sessionStorage.clear();
    this.router.navigate(['/search-partner'])
  }
  }




  public getPartner(){
      let GET_PARTNER_BY_ID = environment.APIEndpoint+"api/rpa/master/partner/v1/view";
      let request = {
            partnerId:this.partnerId
      }
      this.http.postJson(GET_PARTNER_BY_ID,request)
      .subscribe(
        (response) => {
        console.log(response);
        this.partnerData = response;
        for(let partner of this.partnerData.partnerLocales){
          this.alignCss.push(partner.languageDirection == 'RTL' ? 'text-right' : '');
        }
     this.checked = response['status']=='ONLINE'?true:false;
    },err => {
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
    localStorage.setItem('PartnerEditID',ID);
    this.router.navigate(['/edit-partner'])
}

}
