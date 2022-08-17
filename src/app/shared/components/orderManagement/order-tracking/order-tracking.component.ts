import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  @Input() trackingDetails;
  @Input() orderType;

  constructor() { }

  ngOnInit() {
  }

}
