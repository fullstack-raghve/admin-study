import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatButtonToggleModule} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectedstoreDataComponent } from "../../selectedstore-data/selectedstore-data.component";

@Component({
  selector: 'app-view-assign-physical-cards',
  templateUrl: './view-assign-physical-cards.component.html',
  styleUrls: ['./view-assign-physical-cards.component.scss']
})
export class ViewAssignPhysicalCardsComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Assign-Physical-cards',
    link: '/view-assign-physical-cards'
  }
  ];
  AssignID: any;
  ViewJson:any;
  PopupData=[];
  loadingResponse=true;
  giftCardList=[]
  constructor(   private http: HttpService,
    public router: Router, private activatedRoute: ActivatedRoute,public dialog: MatDialog ) {
      this.activatedRoute.params.subscribe((params) => {
        this.AssignID = params.id;
  
      })
    }
  ngOnInit() {
    this.getData();
  }
  getData(){
    let TEMPURL = 'https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_cards_view';
    let data = {
      "languageCode": "en",
      "assignmentId":this.AssignID
    }
    return this.http.postCustomizeJson(TEMPURL, data)
    .subscribe((response) => {
      this.ViewJson={}
      this.ViewJson = response['Output'][0];
      this.giftCardList = this.ViewJson['cardName']
      this.PopupData= this.ViewJson['selectedCardDetail'];
      this.loadingResponse=false;
      // console.log(this.ViewJson);
    });
  }
  addGiftCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    // console.log(this.PopUPData);
    let value: any;
 
    const dialogRef = this.dialog.open(SelectedstoreDataComponent,
      {panelClass: 'dialoggiftcardStyleChange'}
    ); dialogRef.componentInstance.selectedphysicalCards = this.PopupData;
    dialogRef.componentInstance.GiftCardDetails = this.PopupData;
    dialogRef.componentInstance.selectAll = true;
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));
   
      
    });
  }
}
