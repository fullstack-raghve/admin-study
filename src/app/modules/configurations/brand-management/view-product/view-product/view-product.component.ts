import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';


@Component({
  selector: 'view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  public imgUploadSku = false;
  public imgUploadEnglish = false;
  public imgUploadProductEnglish = false;
  public imgUploadProductArabic = false;
  public toggleVal: boolean = true;
  public productImgEnglish:any = '';
  public productImgArabic:any = '';
  public skuImg:any = '';
    public breadCrumbData: Array<Object> = [{
        title: 'Brand Management',
        link: ''
      },{
        title: 'View Product',
        link: 'view-product'
      }
      ];

      public filePathUrl=localStorage.getItem("imgBaseUrl");
      public previousUrl = localStorage.getItem('previousUrl');
      public brandRegionOid : number;
      public brandWallOid : number;
      public brandOid : number;
      public countryOid : number;
      public brandWallData;
      public alignCss=[];
      public checked=false;

      constructor(private fb: FormBuilder,private activatedRoute: ActivatedRoute,
        private http:HttpService,public snackBar: MatSnackBar,private https: HttpService) {
          this.activatedRoute.params.subscribe((params) => {
                this.brandRegionOid = params['brandRegionId']
                this.brandWallOid = params['brandWallId'];
                this.brandOid = params['brandId'];
                this.countryOid = params['countryId'];
            });
        }

        ngOnInit() {
          this.getBrandWallById();
        }
      

   public getBrandWallById(){
    let GET_BRAND_WALL_BY_ID = environment.APIEndpoint+"api/rpa/master/brand/wall/v1/view";
    let request = {
      brandWallOid:this.brandWallOid
    }
    this.http.postJson(GET_BRAND_WALL_BY_ID,request)
    .subscribe((response) => {
            this.brandWallData= response;
            this.checked = response['status']=='ONLINE'?true:false;
            for(let c of this.brandWallData.brandWallLocales){
                this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
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
        })
      }
}

