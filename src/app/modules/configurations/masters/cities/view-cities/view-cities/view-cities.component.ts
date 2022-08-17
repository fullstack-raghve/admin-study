import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
    selector: 'view-cities',
    templateUrl: './view-cities.component.html',
    styleUrls: ['./view-cities.component.scss']
})
export class ViewCitiesComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'City',
        link: '/search-cities'
    }
    ];

    public checked=false;
    public cityId;
    public cityData;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute, private router:Router,
        private http: HttpService, public snackBar: MatSnackBar) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.cityId = params.id;

        // });
    }

    ngOnInit() {
        // this.getCityById();
        let data=localStorage.getItem('CitiesViewID');
        if(data){
            this.cityId=data;
            this.getCityById();
            localStorage.removeItem('CitiesViewID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-cities'])
        }
    }

    getCityById() {
        let GET_CITY_BY_ID = environment.APIEndpoint + "api/rpa/master/city/v1/view";
        let request = {
            cityId: this.cityId
        }
        this.http.postJson(GET_CITY_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.cityData = response;
                for(let cy of this.cityData.cityLocales){
                    this.alignCss.push(cy.languageDirection == 'RTL' ? 'text-right' : '');
                }
                this.checked= response['status']=='ONLINE'?true:false;

            }
            , err => {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }
                });
                console.log("error Status = " + err.status);

            })
    }
    MoveToEdit(ID){
        localStorage.setItem('CitiesEditID',ID);
        this.router.navigate(['/edit-cities'])
      }

}
