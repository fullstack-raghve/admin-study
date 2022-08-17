import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-client-on-boarding',
  templateUrl: './view-client-on-boarding.component.html',
  styleUrls: ['./view-client-on-boarding.component.scss']
})
export class ViewClientOnBoardingComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public viewData;
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  constructor(private http:HttpService,public snackBar: MatSnackBar,
    private router: Router) {
   }

  ngOnInit() {
    this.getViewData();
  }

  getViewData(){
    let GET_ALL_ONBOARDING = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
        this.http.getJson(GET_ALL_ONBOARDING)
            .subscribe((response) => {
                if(response["clientId"]){
                    this.viewData = response;
                }else if (response["message"]){
                  this.router.navigate(['/add-client-on-boarding']);
                }
            } ,err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1500,
                  data: {
                      status: "failure",
                      message: "Your request cannot be saved at this time. Please try again later"
                  }
              });
              this.router.navigate(['/add-client-on-boarding']);

          })

  }
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
    }, {
        title: 'Client On Boarding',
        link: '/view-client-on-boarding'
    }
  ];
  goToEdit(data){
    localStorage.setItem('viewClientKey', data);
    this.router.navigate(['/edit-client-on-boarding']);
  }
}
