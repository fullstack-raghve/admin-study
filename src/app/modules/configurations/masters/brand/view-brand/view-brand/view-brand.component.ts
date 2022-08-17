import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-brand',
  templateUrl: './view-brand.component.html',
  styleUrls: ['./view-brand.component.scss']
})
export class ViewBrandComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
}, {
    title: 'Configurations',
    link: '/search-brand'
}
];
  public statusValue:string ;
  public filePathUrl=environment.APIEndpoint+"img/";
  checked = true;
  disabled = true;
  public mallId:number;
  public mallData;
  public alignCss=[];

  constructor(private activatedRoute: ActivatedRoute,
  private http:HttpService,public snackBar: MatSnackBar) {
    // this.activatedRoute.params.subscribe((params) => {
    //       this.mallId = params.id;

    //   });
  }

 ngOnInit() {
    // this.getMallById();
 }
//  public getMallById(){
//     let GET_MALL_BY_ID = environment.APIEndpoint+"api/rpa/master/mall/v1/view";
//     let request = {
//         mallId:this.mallId
//     }
//     this.http.postJson(GET_MALL_BY_ID,request)
//     .subscribe((response) => {
//             console.log(response);
//             this.mallData= response;
//             for(let m of this.mallData.mallLocales){
//                 this.alignCss.push(m.languageDirection == 'RTL' ? 'text-right' : '')
//             }
//             this.statusValue=this.mallData.status;
//             this.checked=this.mallData.status=='ONLINE'?true:false;

//         }
//         ,err => {
//             this.snackBar.openFromComponent(SnackBarComponent, {
//                 duration: 1500,
//                 data: {
//                     status: "failure",
//                     message: "Your request cannot be saved at this time. Please try again later"
//                 }
//             });
//               console.log("error Status = "+err.status);

//         })
//  }
public toggleStatus(event){
    if(event.checked==true){
        this.statusValue='Online';
    }else{
         this.statusValue='Offline';
    }

}
}
