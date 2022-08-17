import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
export class ViewLocationComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
    title: 'Home',
    link: ''
  },
  {
    title: 'Events',
    link: '/search-events'
  }
  ];
  public locationData:any = [];
  loading:boolean = true;

  constructor(private fb:FormBuilder,private http:HttpService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let locationid = this.activatedRoute.snapshot.params.id;
//  this.loadData();
  this.viewLocation(locationid);
  }

viewLocation(locationid){
 let data = {
    "locationOid": +locationid,
   "languageCode": "en"
  }
  this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin_location/view_location',data).subscribe(res => {
   // console.log('view location res',res);
    let data = res['output'];
    if(data){
      this.loading = false;
      this.locationData = data[0];
    }
  })

}

}
