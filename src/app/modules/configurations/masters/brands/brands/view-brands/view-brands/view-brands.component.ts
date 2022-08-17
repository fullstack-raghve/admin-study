import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-brands',
  templateUrl: './view-brands.component.html',
  styleUrls: ['./view-brands.component.scss']
})
export class ViewBrandsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Brand',
          link: '/search-brands'
      }
    ];
    public brandId:number;
    public brandData;
    public brandImage:string = '';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    isChecked:boolean = false;
    constructor(private activatedRoute: ActivatedRoute,
    private http:HttpService,public snackBar: MatSnackBar) {
      this.activatedRoute.params.subscribe((params) => {
            this.brandId = params.id;

        });
    }

    ngOnInit() {
        this.getBrandById();
    }
    getBrandById(){
        let GET_BRAND_BY_ID = environment.APIEndpoint+"api/rpa/master/brand/v1/view";
        let request = {
            brandId:this.brandId
        }
        this.http.postJson(GET_BRAND_BY_ID,request)
        .subscribe((response) => {
                this.brandData= response;
                this.brandImage = response['imagePath'];
                let status= response['status'];
                if(status == 'ONLINE'){
                    this.isChecked = true;
                }else{
                    this.isChecked = false;
                }

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


}
