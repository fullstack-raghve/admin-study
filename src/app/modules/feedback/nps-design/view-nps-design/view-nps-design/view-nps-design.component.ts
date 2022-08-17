import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-view-nps-design',
  templateUrl: './view-nps-design.component.html',
  styleUrls: ['./view-nps-design.component.scss']
})
export class ViewNpsDesignComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Feedback",
      link: ""
    },
    {
      title: "NPS Design",
      link: ""
    }
  ];
  public statusValue = "ONLINE";
  public reactions;
  public viewNpsDatacolourCodingCreateBean;
  public toggleVal = true;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  
  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private https: HttpService,) { }

  ngOnInit() {
    this.getNpsView();
  }

  getNpsView(){
    this.http.getJson(environment.APIEndpoint + 'api/rpa/feedback/nps/sentiment/v1/view').subscribe(
      (response)=>{
        console.log(response);
        this.reactions = response['sentimentCreateBean'];
        this.viewNpsDatacolourCodingCreateBean = response['colourCodingCreateBean'];
        console.log(this.reactions);
        console.log(this.viewNpsDatacolourCodingCreateBean)
      },
      (error) => {
        console.log(error);
      }
    );
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
  }
}
