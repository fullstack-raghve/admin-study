import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {
  invoiceData: any;
  invoiceDataProductDetails: any;
  txnOid: any;

  constructor(
    private https: HttpService,
    public snackBar: MatSnackBar,
    private http:HttpService,
    private activatedRoute: ActivatedRoute,) {
        this.activatedRoute.params.subscribe((params) => {
          this.txnOid = params['id'];
      });
      this.getInvoiceById();
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.printPage();
  }

  public getInvoiceById(){
    let GET_BRAND_BY_ID = environment.APIEndpoint+"api/rpa/order/v1/getOrderDetail";
    let request = {
      txnOid:this.txnOid
    }
    this.http.postJson(GET_BRAND_BY_ID,request)
    .subscribe((response) => {
            this.invoiceData= response;
            this.invoiceDataProductDetails = response['productDetails'];
        }
        ,err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                }
            });
        });
      }
      printPage() {
        window.print();
      }
}
