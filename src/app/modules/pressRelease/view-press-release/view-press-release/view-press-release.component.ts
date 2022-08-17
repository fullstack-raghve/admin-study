import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { __values } from 'tslib';

@Component({
  selector: 'view-press-release',
  templateUrl: './view-press-release.component.html',
  styleUrls: ['./view-press-release.component.scss']
})
export class ViewPressReleaseComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Press Release',
    link: ''
  },
  ];

  public prId: number = 0;
  public releaseData: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public publishToDate;
  public publishFromDate;
  public checked = false;
  public statusValue;
  public alignCss = [];
  public langfield = [];
  country: string;
  countryName: string;
  languageDirection = [];

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpService, 
    public snackBar: MatSnackBar, 
    public router: Router) {
  }

  ngOnInit() {
    let data = localStorage.getItem('PressReleaseId');
    if(data){
      this.prId=Number(data);
      this.getPressReleaseById();
      localStorage.removeItem('PressReleaseId')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-press-release'])
    }
  }

  public getPressReleaseById() {
    let GET_PRESS_RELEASE_BY_ID = environment.APIEndpoint + "api/rpa/pressrelease/v1/view";
    let request = {
      pressReleaseId: this.prId
    }
    this.http.postJson(GET_PRESS_RELEASE_BY_ID, request)
      .subscribe((response) => {
        this.releaseData = response;
        this.checked = this.releaseData.status == 'ONLINE' ? true : false
        this.statusValue = this.releaseData.status;
        for (let r of this.releaseData.pressReleaseLocaleList) {
          this.alignCss.push(r.languageDirection == 'RTL' ? 'text-right' : '');
          this.langfield.push(r.languageDirection == 'RTL' ? 'lang-name-right' : '');
          this.languageDirection.push(r.languageDirection == 'RTL' ? 'direction' : '');
        }
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
  }

  MoveToEdit(ID){
    localStorage.setItem('PressReleaseEditId',ID);
    this.router.navigate(['/edit-press-release']);
  }
}
