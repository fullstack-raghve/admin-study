import {OnInit,   Component} from "@angular/core";
import {  MatDialogRef } from "@angular/material";
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-global-popup',
  templateUrl: './global-popup.component.html',
  styleUrls: ['./global-popup.component.scss']
})
export class GlobalPopupComponent implements OnInit {
  
  checkData;
  loading=false;
  constructor(private dialogRef: MatDialogRef<GlobalPopupComponent>, private https: HttpService,    public snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  CheckInfo(value) {
    let result;

    if(value == 'Yes'){
      this.loading = true;
      if(this.checkData == true){
        result = 1;
      }else{
        result = 0;
      }
      let data={
        isGlobalDelivery:result
      }
      this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v1/update/GlobalDelivery', data
      ).subscribe(
        (res) => {
          this.loading = false;
          console.log(res);
          this.dialogRef.close(value);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 5000,
            data: {
              status: "success",
              message: "Status updated successfully"
            }
          });
    
        },  err => {
          this.loading = false;
          
            });
        // this.dialogRef.close(value);

    }else{
      this.dialogRef.close(value);
    }
       
    

  
  
  }

  

}
