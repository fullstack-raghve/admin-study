import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../../../services/http-service';
import * as access from '../../../../constants/menu.constant';

export interface StoreData {
  storeId: string;
  storeName: string;
  address: string;
}

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit, AfterViewInit {

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'User Management',
    link: '/search-user'
  }];
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<StoreData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public href;
  public toggleVal;
  public disabled: boolean = true;
  public checked: boolean = true;
  public viewUserData;
  public permissionList;
  // public acessList = access.permissions.data;

  public acessList;


  // constructor(public dialog: MatDialog<ViewUserComponent>) {
  constructor(private router: Router,
    private https: HttpService,
    public route: ActivatedRoute) {

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    console.log(this.acessList);

    if (localStorage.getItem('UserViewID')) {
      this.href = localStorage.getItem('UserViewID');
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.getViewData();
      localStorage.removeItem('UserViewID')
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-user']);
    }
    this.getviewMenus();
  }

  getviewMenus(){
    let viewUserMenus = environment.APIEndpoint + 'api/rpa/user/v1/menus';
    this.https.getJson(viewUserMenus).subscribe(
      (response)=>{
        console.log(response['data']);
        this.acessList = response['data'];
      }
    )
  }


  getViewData() {
    // this.href = this.route.snapshot.params['id'];
    let data = {
      "userId": this.href
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/view', data).subscribe(res => {
      console.log(res);
      this.viewUserData = res;
      this.dataSource.data = res["userStores"] == null ? '' : res["userStores"];
      this.permissionList = res["menuIds"];
      this.toggleVal = res["status"] == "ONLINE" ? true : false
      console.log(this.viewUserData);
      //  alert(JSON.stringify('viewUserData'));
    }, err => {
      console.log(err);
      if (err.status == 0) {
        this.getViewData();
      }
    })
  }


  openDialog() {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  MoveToEdit(ID) {
    localStorage.setItem('UserEditID', ID);
    this.router.navigate(['/edit-user']);
  }

}
// @Component({
//   selector: 'app-dialog-content-example-dialog',
//   templateUrl: 'dialog-content-example-dialog.html',
// })
// export class DialogContentExampleDialogComponent {}
