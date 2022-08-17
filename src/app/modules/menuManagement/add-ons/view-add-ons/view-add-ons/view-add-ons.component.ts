import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-add-ons',
  templateUrl: './view-add-ons.component.html',
  styleUrls: ['./view-add-ons.component.scss']
})
export class ViewAddOnsComponent implements OnInit {
  public imgUpload = false;
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Add-ons',
    link: '/view-add-ons'
  }
  ];

  public productAddonData;
  public addonOid: number;
  public alignCss = [];
  public checked = false;
  // public filePathUrl=environment.APIEndpoint+"img/";
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imagePath: string = '';
  count = 0;
  columns = [];
  languageDirection = [];
  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpService, public snackBar: MatSnackBar) {
    this.activatedRoute.params.subscribe((params) => {
      this.addonOid = params.id;
    });
  }

  ngOnInit() {
    this.getProductAddonById();
  }

  incrementColumn() {
    this.count += 1;
    if (this.count < 4) {
      this.columns.push(this.count);
    }
  }

  public getProductAddonById() {
    let GET_PRODUCT_ADDON_BY_ID = environment.APIEndpoint + "api/rpa/menu/addon/v1/view";
    let request = {
      addonOid: this.addonOid
    }
    this.http.postJson(GET_PRODUCT_ADDON_BY_ID, request)
      .subscribe((response) => {
        console.log(response);
        this.productAddonData = response;
        console.log(this.productAddonData);
        for (let c of this.productAddonData.productAddonLocales) {
          this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
          this.languageDirection.push(c.languageDirection == 'RTL' ? 'direction' : '');
        }
        this.imagePath = response['addonImagePath']
        this.checked = response['status'] == 'ONLINE' ? true : false;

      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
          console.log("error Status = " + err.status);

        })
  }

}
