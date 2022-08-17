import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'view-currency-conversion',
  templateUrl: './view-currency-conversion.component.html',
  styleUrls: ['./view-currency-conversion.component.scss']
})
export class ViewCurrencyConversionComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Currency Conversion',
          link: '/search-currency-conversion'
      }
    ];
    checked=true
    disabled:boolean = true;
    public conversionId;
    public conversionData:any=[];
    public baseCurrencyData;
    public toggleVal;
    constructor(private http:HttpService,private router: Router,
         public snackBar: MatSnackBar,private activatedRoute: ActivatedRoute,)  {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.conversionId = params.id;

        // });
    }

  ngOnInit() {
      // this.getCurrencyConversion();
      // this.getBaseCurrency();

      let data= localStorage.getItem('CurrencyConversionViewID');
      if(data){
        this.conversionId=data;
        this.getCurrencyConversion();
              this.getBaseCurrency();
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-currency-conversion']);
      }
      

  }
  getCurrencyConversion(){
      let GET_CURRENCY_CONVERSION_BY_ID = "api/rpa/master/currencyconversion/v1/view";
        let request={
            currencyConversionId:this.conversionId
        }
      this.http.postJson(environment.APIEndpoint+GET_CURRENCY_CONVERSION_BY_ID,request)
      .subscribe((response) => {
              console.log(response);
               this.toggleVal=(response['status']=='ONLINE'?true:false);
               this.conversionData=response;
               this.checked=response['status']=='ONLINE'?true:false;


          })
  }
  public getBaseCurrency(){
      let GET_BASE_CURRENCY = "api/rpa/master/currency/v1/getbasecurrency";
      this.http.getJson(environment.APIEndpoint + GET_BASE_CURRENCY)
      .subscribe((response) => {
          this.baseCurrencyData=response;

      })

  }

  MoveToEdit(ID){
    localStorage.setItem('CurrencyConversionEditID',ID);
    this.router.navigate(['/edit-currency-conversion'])
  }
}
