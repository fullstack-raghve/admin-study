import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-malls',
  templateUrl: './view-malls.component.html',
  styleUrls: ['./view-malls.component.scss']
})
export class ViewMallsComponent implements OnInit {

    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Mall',
          link: '/search-malls'
      }
    ];
    public statusValue:string ;
    public filePathUrl=localStorage.getItem("imgBaseUrl");
    checked = true;
    disabled = true;
    public mallId;
    public mallData;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router: Router,
    private http:HttpService,public snackBar: MatSnackBar) {
    //   this.activatedRoute.params.subscribe((params) => {
    //         this.mallId = params.id;

    //     });
    }

   ngOnInit() {
    //   this.getMallById();
      let data =  localStorage.getItem('MallViewID');
      if(data){
        this.mallId = data;
        this.getMallById();
      }else{
          sessionStorage.clear();
          this.router.navigate(['/search-malls'])
      }

   }
   public getMallById(){
      let GET_MALL_BY_ID = environment.APIEndpoint+"api/rpa/master/mall/v1/view";
      let request = {
          mallId:this.mallId
      }
      this.http.postJson(GET_MALL_BY_ID,request)
      .subscribe((response) => {
              console.log(response);
              this.mallData= response;
              for(let m of this.mallData.mallLocales){
                  this.alignCss.push(m.languageDirection == 'RTL' ? 'text-right' : '')
              }
              this.statusValue=this.mallData.status;
              this.checked=this.mallData.status=='ONLINE'?true:false;

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
  public toggleStatus(event){
      if(event.checked==true){
          this.statusValue='Online';
      }else{
           this.statusValue='Offline';
      }

  }
  MoveToEdit(ID){
    localStorage.setItem('MallEditID',ID);
        this.router.navigate(['/edit-malls'])
  }
}
