import { Injectable } from '@angular/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';

@Injectable(
  { providedIn: 'root' }
)
export class CommonFunctions {
  constructor(public snackBar: MatSnackBar) { }

  displayErrorMessage(error, duration = 10000) {
    if (error == 'zeroCurrency'){
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: "failure",
          message: "Oops! You have already created wallet with all the available currencies. You can try back again later"
        }
      });
    }else if (error.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration,
        data: {
          status: "failure",
          message: error.error.errorDetails[0].description
        }
      });
    } else if (error.status == 400) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: error.error.responseBody.message
        }
      });
    }
    else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration,
        data: {
          status: "failure",
          message: "Your request cannot be processed at this time. Please try again later"
        }
      });
    }
  }
  // 
  initPaginationData(resultsLength = 0) {
    return {
      pageIndex: 0,
      pageSize: 10,
      length: resultsLength,
      previousPageIndex: 0
    };
  }

  displaySnackBarMessage(status, message) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      data: {
        status: status,
        message: message
      }
    });
  }

  checkFilterContainsData(data){
    for (var key in data) 
      if (data[key] !== null && data[key] != "")
          return true;
    return false;
  }
}
