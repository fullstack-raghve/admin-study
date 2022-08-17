import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'view-about-us-category',
  templateUrl: './view-about-us-category.component.html',
  styleUrls: ['./view-about-us-category.component.scss']
})
export class ViewAboutUsCategoryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'About Us Category',
    link: '/search-country'
  }
  ];
  public aboutUsCategoryId;
  public aboutUsData;
  public locales;
  public checked = false;
  public alignCss = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpService, public snackBar: MatSnackBar) {
    // this.activatedRoute.params.subscribe((params) => {
    //        this.aboutUsCategoryId = params.id;
    //   });
  }

  ngOnInit() {
    // this.getAboutUsById();
    let data = localStorage.getItem('ABSViewID');
    if (data) {
      this.aboutUsCategoryId = data;
      this.getAboutUsById();
      localStorage.removeItem('ABSViewID')
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-about-us-category']);
    }
  }

  public getAboutUsById() {
    let request = {
      aboutUsCategoryId: this.aboutUsCategoryId
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/master/aboutus/category/v1/view", request)
      .subscribe((response) => {
        this.aboutUsData = response;
        this.locales = this.aboutUsData.aboutUsCategoryLocales;
        this.checked = response['status'] == 'ONLINE' ? true : false;
        for (let i = 0; i < this.locales.length; i++) {
          this.alignCss.push(this.locales[i].languageDirection == 'RTL' ? 'text-right' : '');
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
        })
  }
  MoveToEdit(ID) {
    localStorage.setItem('ABSEditID', ID);
    this.router.navigate(['/edit-about-us-category'])
  }

}
