import { OnInit, Component, Input} from '@angular/core';
import { MatDialog, MatDialogRef} from '@angular/material';

@Component({
    selector: 'product-online-offline-dialogue',
    templateUrl: 'product-online-offline-dialogue.component.html',
    styleUrls: ['product-online-offline-dialogue.component.scss']
  })

  export class productOnlineOfflineDialog implements OnInit {
    // @Input('statusValue')statusValue;
      constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<MatDialog>) {
            dialogRef.disableClose = true;
        }

        clickVal(dataVal){
          this.dialogRef.close(dataVal);
        }

      ngOnInit() {

      }
  }
