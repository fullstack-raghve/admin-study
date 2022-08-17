import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'view-currency',
  templateUrl: './view-currency.component.html',
  styleUrls: ['./view-currency.component.scss']
})
export class ViewCurrencyComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      },{
          title: 'Currency',
          link: '/search-currency'
      }
    ];
    checked = false;
    disabled = true;
    public currencyId;
    public currencyData;
    public alignCss=[];
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private http:HttpService,public snackBar: MatSnackBar) {
    //   this.activatedRoute.params.subscribe((params) => {
    //         this.currencyId = params.id;

    //     });
    }

    ngOnInit() {
        // this.getCurrencyById();
        let data=localStorage.getItem('CurrencyViewID');
        if(data){
            this.currencyId=data;
            this.getCurrencyById();
          localStorage.removeItem('CurrencyViewID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-currency'])
        }
    }
    public getCurrencyById(){
        let GET_CURRENCY_BY_ID = environment.APIEndpoint+"api/rpa/master/currency/v1/view";
        let request = {
            currencyId:this.currencyId
        }
        this.http.postJson(GET_CURRENCY_BY_ID,request)
        .subscribe((response) => {
                console.log(response);
                this.currencyData= response;
                for(let cn of this.currencyData.currencyLocales){
                    this.alignCss.push(cn.languageDirection == 'RTL' ? 'text-right' : '');
                }
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
        localStorage.setItem('CurrencyEditID',ID);
        this.router.navigate(['/edit-currency'])
      }

}
