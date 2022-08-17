import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'view-variants',
  templateUrl: './view-variants.component.html',
  styleUrls: ['./view-variants.component.scss']
})
export class ViewVariantsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
}, {
    title: 'Variants',
    link: '/view-variants'
}
];
  public checked=false;
    public variantsOid:number;
    public variantsData;
    public variantTypeList:any;
    public alignCss=[];
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    languageDirection = [];
    constructor(private activatedRoute: ActivatedRoute,
      private http:HttpService,public snackBar: MatSnackBar) {
        this.activatedRoute.params.subscribe((params) => {
              this.variantsOid = params.id;
          });
      }

  ngOnInit() {
    this.getVariantsById();
  }

  public getVariantsById(){
    let GET_VARIANTS_BY_ID = environment.APIEndpoint+"api/rpa/menu/variant/v1/view";
    let request = {
      variantOid:this.variantsOid 
    }
    this.http.postJson(GET_VARIANTS_BY_ID,request)
    .subscribe((response) => {
            console.log(response);
            this.variantsData= response;
            this.variantTypeList=response["variantTypes"];
            console.log(this.variantTypeList);
            this.checked = response['status']=='ONLINE'?true:false;
            for(let ln of this.languageList){
              this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
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
