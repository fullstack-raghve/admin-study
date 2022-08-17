import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-language',
  templateUrl: './view-language.component.html',
  styleUrls: ['./view-language.component.scss']
})
export class ViewLanguageComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Language',
          link: '/search-country'
      }
    ];

    public languageId;
    public languageData:any=[];
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
    private http:HttpService,public snackBar: MatSnackBar) {
      // this.activatedRoute.params.subscribe((params) => {
      //       this.languageId = params.id;

      //   });
    }

  ngOnInit() {
      // this.getLanguageById();
      let data=localStorage.getItem('LanguageViewID');
      if(data){
        this.languageId = data;
        this.getLanguageById();
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-language'])
      }
  }
  public getLanguageById(){
      let GET_LANGUAGE_BY_ID = environment.APIEndpoint+"api/rpa/master/language/v1/view";
      let request = {
          languageId:this.languageId
      }
      this.http.postJson(GET_LANGUAGE_BY_ID,request)
      .subscribe((response) => {
              console.log(response);
              this.languageData= response;

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
    localStorage.setItem('LanguageEditID',ID);
    this.router.navigate(['/edit-language'])
  }

}
