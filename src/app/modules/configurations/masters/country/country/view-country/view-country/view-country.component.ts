import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'view-country',
  templateUrl: './view-country.component.html',
  styleUrls: ['./view-country.component.scss']
})
export class ViewCountryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Masters',
          link: '/search-country'
      }
    ];
    public checked=false;
    public countryId;
    public countryData;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private http:HttpService,public snackBar: MatSnackBar) {
    //   this.activatedRoute.params.subscribe((params) => {
    //         this.countryId = params.id;

    //     });
    }

  ngOnInit() {
    //   this.getCountryById();
      let data=localStorage.getItem('CountryViewID');
      if(data){
          this.countryId=data;
        this.getCountryById();
        localStorage.removeItem('CountryViewID')
      }else{
          sessionStorage.clear();
          this.router.navigate(['/search-country'])
      }
  }
  public getCountryById(){
      let GET_COUNTRY_BY_ID = environment.APIEndpoint+"api/rpa/master/country/v1/view";
      let request = {
          countryId:this.countryId
      }
      this.http.postJson(GET_COUNTRY_BY_ID,request)
      .subscribe((response) => {
              console.log(response);
              this.countryData= response;
             for(let c of this.countryData.countryLocales){
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
    localStorage.setItem('CountryEditID',ID);
    this.router.navigate(['/edit-country'])
  }
}
