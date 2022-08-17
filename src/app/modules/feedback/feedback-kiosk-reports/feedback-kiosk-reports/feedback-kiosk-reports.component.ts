import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'feedback-kiosk-reports',
  templateUrl: './feedback-kiosk-reports.component.html',
  styleUrls: ['./feedback-kiosk-reports.component.scss']
})
export class FeedbackKioskReportsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: 'Feedback',
      link: ''
    },
    {
      title: 'Reports',
      link: ''
    }
  ];

  public UserId = localStorage.getItem("userId");
  public reportsUrl: any;
  url: string;
  public pageLoader: boolean = false;

  constructor(
    private http: HttpService,
    private router: Router,
    private sanitized: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.getKioskReports();
  }
  public getKioskReports() {
    this.pageLoader =true;
    let GET_DATA = environment.APIEndpoint + 'api/rpa/feedback/report/v1/getFeedbackReport?userId=' + this.UserId;
    this.http.getJson(GET_DATA).subscribe(
      (res) => {
        console.log(res);
        this.reportsUrl = res["url"];
        this.pageLoader =false;
        // this.url = this.reportsUrl + "&output=embed";
        // window.location.replace(url);
      }
    )
  }
}
