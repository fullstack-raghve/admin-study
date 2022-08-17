import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { interval, Subscription} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-refresh-cache',
  templateUrl: './refresh-cache.component.html',
  styleUrls: ['./refresh-cache.component.scss']
})
export class RefreshCacheComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Refresh Menu',
    link: '/refresh-cache'
  }
  ];
  public loading: boolean = false;

  constructor(private http: HttpService,
    public snackBar: MatSnackBar ) { 
    }

  ngOnInit() {
  }

    mySubscription: Subscription
  clearCache() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/cache/remove/redisjob')
      .subscribe((response) => {
        if(response['scheduleState'] == 'RUNNING'){
          this.loading = true;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
                status: "success",
                message: response['message']
            }
        });

      this.mySubscription = interval(5000).subscribe((x =>{
        this.checkStatus(response['oid']);
        console.log(response['scheduleState']);
          }));
          console.log(response['scheduleState']);
        } 
      },
        (err: any) => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
                this.loading = false;
                  this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Sorry! Your request cannot be performed at this time. Please try again later or contact administrator"
                    }
                });
      }
       })
      }

      checkStatus(oid) {
        this.http.getJson(environment.APIEndpoint + 'api/rpa/cache/check/redisjobStatus?oid=' + oid)
          .subscribe((response) => {
            console.log(response);
            if(response['scheduleState'] == 'RUNNING'){
              this.loading = true;
            } else{
              if(response['scheduleState'] == 'COMPLETED'){
                this.loading = false;
                this.mySubscription.unsubscribe();
              }
            }
           })
        }
    }


