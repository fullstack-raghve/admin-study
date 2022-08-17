import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
export interface UserData {
  
  cardOid: number;
  type: string;
  cardType: string,
  CorporteORstoreName: string;
  status: string;
  barcode: string;
  lastModifieddate: string;
  storeId: string;
  SLNO:number;
}
@Component({
  selector: 'app-search-search-gift-cards',
  templateUrl: './search-search-gift-cards.component.html',
  styleUrls: ['./search-search-gift-cards.component.scss']
})
export class SearchSearchGiftCardsComponent implements OnInit {

  public searchSearchGiftCardForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  
  public displayedColumns: string[] = [ 'SLNO','type', 'cardType','barcode', 'status', 'lastModifieddate','CorporteORstoreName',  'storeId',];
  public status = true;
  public dataSource;
  public searchGiftVal: boolean = true;
  public noRecords: boolean = false;
  cardDetails=[]
  storeIdDetails=[]
  corporateDetails=[]
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notification_data: UserData[] = []
  cardName: any;
  // cardOid: number;
  constructor(private fb: FormBuilder, private https: HttpService,) { }

  ngOnInit() {
  
    this.buidsearchNotificationForm();
    this.searchVal()
    this.getCardType()
    this.getStoreId()
    this.getCorporateNames()
  }

  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchSearchGiftCardForm = this.fb.group({
      searchcardOid: [""],
      type: [""],
      cardType: [""],
      corporateId: [0],
      storeOid: [0],
      modifiedFrom: [""],
      modifiedTo: [""],
      status: [""],
    });
   
  }
  
  searchVal() {
 
     let formData=this.searchSearchGiftCardForm.value;
    console.log(formData);
   let data={
      "cardOid": formData.searchcardOid.trim(),
      "type": formData.type,
      "cardType": formData.cardType,
      "corporateId": formData.corporateId,
      "storeOid":  formData.storeOid,
      "modifiedFrom": formData.modifiedFrom,
      "modifiedTo": formData.modifiedTo,
      "status": formData.status
   }
   this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/search_gift_card ', data).subscribe(res => {
    // console.log(res['Output']);
    // console.log(JSON.stringify(res['Output']));
    let result=res['Output']
    this.notification_data=res['Output']
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.searchGiftVal = false;
    if (result == "No data found") {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }
  })
  }
// CARD TYPE
  getCardType(){
    let data={

    }
    this.https.postJson1('https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type', data).subscribe(res => {
      // console.log(res['Output']);
      // console.log(JSON.stringify(res['Output']));
      this.cardDetails=res['Output']
    
    })
  }

  // STORE ID
  getStoreId(){
    let data={

      "languageCode": "en"
      
      }
    this.https.postJson1('https://d46z25amza.execute-api.ap-south-1.amazonaws.com/assignphysical_sit/rest/api/v1/assignPhysical/assigned_physical_stores', data).subscribe(res => {
      // console.log(res['Output']);
      // console.log(JSON.stringify(res['Output']));
      this.storeIdDetails=res['Output']
    
    })
  }
// Corporate names
  getCorporateNames(){
    let data={
      "searchText":""
      }
      
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate', data).subscribe(res => {
      console.log(res['Output']);
      console.log(JSON.stringify(res['Output']));
      this.corporateDetails=res['Output']
    
    })
  }

  resetForm() {
    this.buidsearchNotificationForm()
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    this.dataSource.paginator = this.paginator;
  }
 //  for search
 applyFilter(filterValue: string) {
   console.log(this.dataSource);
   
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.filter !=this.dataSource.filter) {
    this.noRecords = true;
  } else {
    this.noRecords = false;
  }
}

}
