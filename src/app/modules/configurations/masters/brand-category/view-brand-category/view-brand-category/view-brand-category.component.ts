import { Component, OnInit } from '@angular/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-brand-category',
  templateUrl: './view-brand-category.component.html',
  styleUrls: ['./view-brand-category.component.scss']
})
export class ViewBrandCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Brand Category',
          link: '/search-brand-category'
      }
    ];

    checked = false;
    disabled = true;
    public categoryId;
    public brandData;
    public imagePath:string='';
    public filePathUrl=localStorage.getItem('imgBaseUrl');
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private http:HttpService,public snackBar: MatSnackBar) {
    //   this.activatedRoute.params.subscribe((params) => {
    //         this.categoryId = params.id;

    //     });
    }

    ngOnInit() {
        // this.getBrandById();
        let data=localStorage.getItem('BrandCategoryViewID');
        if(data){
            this.categoryId=data;
            this.getBrandById();
            localStorage.removeItem('BrandCategoryViewID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-brand-category'])
        }
    }
    getBrandById(){
        let GET_BRAND_CATEGORY_BY_ID = environment.APIEndpoint+"api/rpa/master/brandCategory/v1/view";
        let request = {
            categoryId:this.categoryId
        }
        this.http.postJson(GET_BRAND_CATEGORY_BY_ID,request)
        .subscribe((response) => {
                console.log(response);
                this.brandData= response;
                for(let cat of this.brandData.brandCategoryLocales){
                    this.alignCss.push(cat.languageDirection == 'RTL' ? 'text-right' : '')
                }
                this.imagePath=response['categoryImgPath']
                this.checked=response['status']=='ONLINE'?true:false;

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
        localStorage.setItem('BrandCategoryEditID',ID);
        this.router.navigate(['/edit-brand-category'])
      }

}
