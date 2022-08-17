import { OnInit, Component, Input} from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';

@Component({
    selector: 'notification.component',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.scss']
  })

  export class notificationDialog implements OnInit {
    @Input('statusValue')statusValue;
      constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<MatDialog>) {
            dialogRef.disableClose = true;
        }

        clickVal(dataVal){
          this.dialogRef.close(dataVal);
        }

      ngOnInit() {

      }
  }
