import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'view-cuisine',
  templateUrl: './view-cuisine.component.html',
  styleUrls: ['./view-cuisine.component.scss']
})
export class ViewCuisineComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
}, {
    title: 'Configurations',
    link: '/search-cuisine'
}
];

public checked=false;
public cityId: number;
public cityData;
public alignCss=[];
constructor(private activatedRoute: ActivatedRoute,
    private http: HttpService, public snackBar: MatSnackBar) {
    // this.activatedRoute.params.subscribe((params) => {
    //     this.cityId = params.id;

    // });
}

ngOnInit() {
    // this.getCityById();
}

// getCityById() {
//     let GET_CITY_BY_ID = environment.APIEndpoint + "api/rpa/master/city/v1/view";
//     let request = {
//         cityId: this.cityId
//     }
//     this.http.postJson(GET_CITY_BY_ID, request)
//         .subscribe((response) => {
//             console.log(response);
//             this.cityData = response;
//             for(let cy of this.cityData.cityLocales){
//                 this.alignCss.push(cy.languageDirection == 'RTL' ? 'text-right' : '');
//             }
//             this.checked= response['status']=='ONLINE'?true:false;

//         }
//         , err => {
//             this.snackBar.openFromComponent(SnackBarComponent, {
//                 duration: 1500,
//                 data: {
//                     status: "failure",
//                     message: "Your request cannot be saved at this time. Please try again later"
//                 }
//             });
//             console.log("error Status = " + err.status);

//         })
// }

}
