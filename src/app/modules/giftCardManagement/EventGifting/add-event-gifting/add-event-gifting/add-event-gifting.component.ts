import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-event-gifting',
  templateUrl: './add-event-gifting.component.html',
  styleUrls: ['./add-event-gifting.component.scss']
})
export class AddEventGiftingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    // link: '/view-client-on-boarding'
  },
  {
    title: 'Add Events',
    link: ''
  }
  ];
  constructor() { }

  ngOnInit() {
  }

}
