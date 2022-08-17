import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'view-e-wallet',
  templateUrl: './view-e-wallet.component.html',
  styleUrls: ['./view-e-wallet.component.scss']
})
export class ViewEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'E-wallet',
    link: ''
  }
  ];

  public toggleVal;
  public checked;
  public loading: boolean = false;
  public id;
  public viewData = [];
  public alignCss = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));

  constructor(private https: HttpService,
    private router: Router) {
  }

  ngOnInit() {
  }


}
