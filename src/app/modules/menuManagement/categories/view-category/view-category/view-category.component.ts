import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router'; import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { ProductDialogComponent } from '../../../../../shared/components/menuManagement/product-dialog/product-dialog.component';
// import { MatDialog, , MatSnackBar } from '@angular/material';

@Component({
  selector: 'view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Categories',
    link: '/search-category'
  }
  ];
  public imgUpload = false;
  public toggleVal = true;
  public checked;
  public imagePath = '';
  public showError = false;
  public showImageError = false;
  public loading = false;
  public statusValue: string = 'ONLINE';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public id;
  public viewData = [];
  addClientOnBoardingGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  brandname = "";
  alignCss = [];
  selectStoreValPass;
  languageDirection = [];

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, ) {
  }
  ngOnInit() {
    this.getViewData();
  }
  categoryName;
  getViewData() {
    this.id = this.router.url.split('view-category/')[1];
    let data = {
      "categoryId": parseFloat(this.id)
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/productcategory/v1/view", data).subscribe(res => {
      this.viewData = res;
      this.selectStoreValPass = res['stores'];
      console.log(this.selectStoreValPass);
      this.brandname = this.viewData["brand"].brandName;
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.statusValue = res['status'];
      this.imgUpload = true;
      for (let prod of this.viewData["categoryLocales"]) {
        if(prod.langName == 'English'){
          this.categoryName = prod.categoryName;
        }
        
        this.alignCss.push(prod.direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(prod.direction == 'RTL' ? 'direction' : '');
      }
    })

  }
  openStoresDialog() {
    const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.componentInstance.selectedStoreData = this.selectStoreValPass;
    dialogRef.afterClosed().subscribe(
      (result) => {

      }
    );
  }
  openProductListDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderId: '',
      storeOid: 133
    }
    dialogConfig.width = "unset";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'view-product-dialogue';
    // let cName =  this.viewData['parentCategoryName'];
    // alert(cName)
    const dialogRef = this.dialog.open(ProductDialogComponent, dialogConfig);

     dialogRef.componentInstance.categoryName = this.categoryName;
     dialogRef.componentInstance.categoryId = parseFloat(this.id);

    dialogRef.afterClosed().subscribe(result => {
    //  console.log(cName);
     
    
    });
  }
}
