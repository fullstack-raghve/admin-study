import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from '../shared/components/snack-bar/snack-bar.component';

@Injectable()
export class OpenSnackService {

    constructor(public snackBar: MatSnackBar) { }

    doOpen(component, duration, status, message) {
        this.snackBar.openFromComponent(component, {
            duration: duration,
            data: {
                status: status,
                message: message
            }
        });
    }

}
