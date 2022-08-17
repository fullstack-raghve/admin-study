import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'view-merchant',
  templateUrl: './view-merchant.component.html',
  styleUrls: ['./view-merchant.component.scss']
})
export class ViewMerchantComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
}, {
    title: 'Configurations',
    link: '/search-cuisine'
}
];

public checked=false;
public cityId: number;
public cityData;
public alignCss=[];
constructor(private activatedRoute: ActivatedRoute,
    private http: HttpService, public snackBar: MatSnackBar) {
    // this.activatedRoute.params.subscribe((params) => {
    //     this.cityId = params.id;

    // });
}

  ngOnInit() {
  }

}
