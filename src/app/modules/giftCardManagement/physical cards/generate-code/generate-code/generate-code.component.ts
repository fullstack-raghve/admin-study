import { MatPaginator, MatSort, MatTableDataSource, MatButtonToggleModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { environment } from './../../.././../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import * as XLSX from 'xlsx';

export interface UserData {
  SL_NO: string;
  BARCODE: string;
  SECRET_CODE: string;
}

@Component({
  selector: 'app-generate-code',
  templateUrl: './generate-code.component.html',
  styleUrls: ['./generate-code.component.scss']
})
export class GenerateCodeComponent implements OnInit {
  download: boolean = false;
  tableShow: boolean = false;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Physical Cards',
    link: ''
  }];
  public searchGeneratedCards: FormGroup;
  public displayedColumns: string[] = ['SL_NO', 'BARCODE', 'SECRET_CODE'];
  public status = true;
  public dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notification_data: UserData[] = [ ];
  CardType=[]
  RangeValue: any;
  LabelArray=[];
  GenerateCodeForm : FormGroup;
  labelStatus:boolean=true;
  NoRecord= false;
  searchStoreVal=false;
  constructor(private formBuilder: FormBuilder, private https: HttpService, private http: HttpService,
    private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private fb: FormBuilder, ) {


  }

  ngOnInit() {
    this.getCardType();
    this.buidsearchNotificationForm();
    this.buildGenerateCodeForm();
    this.getCardType();

  }
  getCardType(){
    let TempURL ="https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_cart_type";
    let data={}
    return this.http.postCustomizeJson(TempURL, data)
    .subscribe((response) => {
       this.CardType=(response['Output']);      
    });

  }
  getRangeValue(value){

    let TempURL ="https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/get_latest_physical_card_code";
    let data = {
      "cardType":value       
      }
      return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        this.GenerateCodeForm.controls['Range'].patchValue(response['Output']['startingCardId'])
        this.RangeValue =(response['Output']['startingCardId']);       
      });
  }
  public showlabel(label: HTMLInputElement) {
    if(this.GenerateCodeForm.controls['labels'].valid){
      if (this.LabelArray.length <5) {
        if (this.LabelArray.includes(label.value)) {
  
        }
        else if(label.value==''){

        }
        else {
          this.labelStatus = true;
          this.LabelArray.push(label.value);
          label.value = '';
        }
  
      }
      else {
        this.labelStatus = false;
        setTimeout(() => {
          this.labelStatus = true;
        }, 2000);
  
      }
    }

  }

  public deletelabel(index: any) {
    this.LabelArray.splice(index, 1);
  }
  openFilter() {
    this.status = !this.status;
  }
  buildGenerateCodeForm(){
    let form = {
      CardID: [""],  
      Quantity: [''],
      Range: [""],
      // percentage: [''],
      labels: ['',Validators.compose([Validators.pattern("^[A-Za-z0-9]{1,10}$")])]

    }
    this.GenerateCodeForm = this.fb.group(form);

  }
  buidsearchNotificationForm() {
    this.searchGeneratedCards = this.fb.group({
      searchVal: [""],
      lastMOdifiedDate: [""],
      // cardValue : [""],
      status: [""],
      // readstatus: ["",],
      // store: ["",]

    });
  }
  // searchVal() {
  //   const notification_data: UserData[] = [
  //     {
  //       serialNo: '1',
  //       id: 'EL43 2345 70001',
  //       securityCode: '345789',
  //     },

  //   ]
  //   this.dataSource = new MatTableDataSource<UserData>(notification_data);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  resetForm() {
    this.router.navigate(['/search-physical-cards'])
    // this.buildGenerateCodeForm();
    // this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
    // this.dataSource.paginator = this.paginator;
  }
  GenerateData(formData) {
    
    this.NoRecord=false;
    // this.giftFormGroup.get('keywords').clearValidators();
    // this.giftFormGroup.get('keywords').updateValueAndValidity();
    let CardID = this.GenerateCodeForm.get('CardID');
    CardID.setValidators([Validators.required]);
    CardID.updateValueAndValidity();
    let Quantity = this.GenerateCodeForm.get('Quantity');
    Quantity.setValidators([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")]);
    Quantity.updateValueAndValidity();
    if(this.GenerateCodeForm.invalid){

    }else{
      this.searchStoreVal=true;
      this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     let TempURL = 'https://2q2gudkg99.execute-api.ap-south-1.amazonaws.com/physicalcard_sit/rest/api/v1/physicalcard/generate_code';
    let data = {
      cardType:formData.CardID,
      startRange:formData.Range,
      quantity:formData.Quantity ,
      label: this.LabelArray
      }
      // console.log(JSON.stringify(data))
      return this.http.postCustomizeJson(TempURL, data)
      .subscribe((response) => {
        // console.log(response)  ;
        this.notification_data = response['Output'];
        this.searchStoreVal=false;
        this.download = true;
        this.tableShow = true;
        this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       if(this.notification_data.length==0){
         this.NoRecord=true;
       }
    
         this.buildGenerateCodeForm();
         this.LabelArray = [];
   
      });
    
    }
  }
  DownloadXLS(value) {
 console.log(this.notification_data)
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.notification_data);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'physicalcard');

    /* save to file */
    XLSX.writeFile(wb, 'PhysicalCards.xlsx');
          
            }
    
    


}

  
 
