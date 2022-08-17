import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-amenities',
  templateUrl: './view-amenities.component.html',
  styleUrls: ['./view-amenities.component.scss']
})
export class ViewAmenitiesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Amenities',
        link: ''
    }
    ];
    public amenityOid;
    public amenityData;
    public amenityImage:string = '';
    public brandName;
    selectStore=false;
    public filePathUrl=localStorage.getItem("imgBaseUrl");
    checked:boolean = false;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router: Router,
    private http:HttpService,public snackBar: MatSnackBar) {
      // this.activatedRoute.params.subscribe((params) => {
      //       this.amenityOid = params.id;

      //   });
    }

  ngOnInit() {
    let data = localStorage.getItem('AmenitiesViewID');
    if(data){
      this.amenityOid = data;
      this.getAmenityById();
     localStorage.removeItem('AmenitiesViewID');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-amenities'])
    }
   
}
getAmenityById(){
    let GET_AMENITY_BY_ID = environment.APIEndpoint+"api/rpa/store/amenity/v1/view";
    let request = {
      amenityOid:this.amenityOid
    }
    this.http.postJson(GET_AMENITY_BY_ID,request)
    .subscribe((response) => {
            this.amenityData= response;
            this.amenityImage = response['amenityImagePath'];
            this.brandName=response['brandName'];
            this.selectStore=response['applyAllStore']
            for(let amenity of this.amenityData.amenityLocales){
              this.alignCss.push(amenity.languageDirection == 'RTL' ? 'text-right' : '');
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
    MoveToEditAmenities(ID){
      localStorage.setItem('AmenitiesEditID',ID);
      this.router.navigate(['/edit-amenities'])
    }

}
