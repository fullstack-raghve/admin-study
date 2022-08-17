import {OnInit,   Component} from "@angular/core";
import {  MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-delivery-popup',
  templateUrl: './delivery-popup.component.html',
  styleUrls: ['./delivery-popup.component.scss']
})
export class DeliveryPopupComponent implements OnInit {
  

  constructor(private dialogRef: MatDialogRef<DeliveryPopupComponent>) { }

  ngOnInit() {
  }
  CheckInfo(value) {
  
    this.dialogRef.close(value);
  }

 

}
