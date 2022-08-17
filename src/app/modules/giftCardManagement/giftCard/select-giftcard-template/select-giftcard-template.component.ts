 
    import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
    import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatSort } from '@angular/material';
    import { FormBuilder, FormGroup } from '@angular/forms';
    import { ActivatedRoute } from '@angular/router';
    import { HttpService } from '../../../../services/http-service';
    // import { environment } from 'src/environments/environment';
    // import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
    import { BehaviorSubject } from 'rxjs';
    import { SelectionModel } from '@angular/cdk/collections';
    // import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
    import {MatPaginator} from '@angular/material/paginator';

    export interface GiftCardData {
      templteId: number;
      templateFor: string;
      headingMessage1: string,
      headingMessage2: string,
      textMessage: string,
      backgroundColor: string,
      backgroundImage: string,
      logoImage: string,
      textColor: string,
      templateName: string,
      languageCode: string,
      languageName: string
    
    }
    
    
    @Component({
      selector: 'app-select-giftcard-template',
      templateUrl: './select-giftcard-template.component.html',
      styleUrls: ['./select-giftcard-template.component.scss']
    })
    
    export class SelectGiftcardTemplateComponent  {
      
      users: any;
      public searchUserForm: FormGroup;
      public paginationData;
      public status = true;
      public selectAll: boolean = false;
      resultsLength: any;
      displayedColumns: string[] = ['select', 'cardName', 'templateFor'];
      // @ViewChild(MatPaginator) paginator: MatPaginator;
      selection = new SelectionModel(true, []);
      corporate_data: GiftCardData[] = [  ];
      dataSource: MatTableDataSource<GiftCardData>;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
      TempateID: any;
      //  dataSource = corporate_data;
      constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<SelectGiftcardTemplateComponent>,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private http: HttpService,
        public snackBar: MatSnackBar) {
    
      }
    
      ngOnInit() {
        
    
        this. getData();
        this.dataSource = new MatTableDataSource<GiftCardData>(this.corporate_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.buildUserForm();
    
      }
    
      getData(){
       
    let TEMPURL = 'https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/get_templates_details';
    let data = {
      languageCode: "EN"
    }
 
    return this.http.postCustomizeJson(TEMPURL, data)
      .subscribe((response) => {
        this.dataSource = response['Output'];
        let notification_data = response['Output'];
        // console.log(notification_data);
          this.dataSource = new MatTableDataSource<GiftCardData>(notification_data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }); 
      }

      paginationDetail = new BehaviorSubject(
        {
          length: 5,
          pageIndex: 0,
          pageSize: 5
        });
        searchVal(){
          // console.log("func");
        }

      getUpdate(event) {
        this.paginationDetail.next(event);
        this.paginationData = event;
      }

    
      isEarnRuleSelected(value: any): boolean {
        if (value.templteId == this.TempateID )
          return true;
        else
          return false;
      }
    
      buildUserForm() {
        this.searchUserForm = this.fb.group({
          searchVal: ['',],
        });
      }
    

    
    }
    