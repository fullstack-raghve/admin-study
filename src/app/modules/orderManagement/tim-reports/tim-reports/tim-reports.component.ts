import { OnInit, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';


@Component({
  selector: 'tim-reports',
  templateUrl: './tim-reports.component.html',
  styleUrls: ['./tim-reports.component.scss']
})
export class TimReportsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
  {title: 'Home', link: ''},
  {title: 'TH Reports', link: ''}];

  public reportsUrl: any;

  constructor(private https: HttpService) {}

  ngOnInit() {
    this.getReports();
  }

  getReports(){
    console.log(this.reportsUrl);
    let REPORT_URL = environment.APIEndpoint + 'api/rpa/master/report/v1/getReportUrl' + '?reportType=' + 'TIM' ;
    this.https.getJson(REPORT_URL)
    .subscribe(
      (response)=>{
        this.reportsUrl = response['url'];
      }
    )
  }
}
