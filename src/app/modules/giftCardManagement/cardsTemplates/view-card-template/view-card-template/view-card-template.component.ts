import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'view-card-template',
  templateUrl: './view-card-template.component.html',
  styleUrls: ['./view-card-template.component.scss']
})
export class ViewCardTemplateComponent implements OnInit {

  //giftcard changes
APIBaseURL: 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/';
APIBaseProjectName: 'sit';

  public statusValue:string = 'ONLINE';
  public toggleVal:boolean;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
    }, {
        title: 'Gift Cards Management',
        // link: '/view-client-on-boarding'
    },
    {
      title: 'Cards Template',
    link: ''
    }
    ];
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    alignCss = [];
    keyWords=[];
    TemplateData=[];
    ViewJson :any;
  storeId: any;
  TemplateFor: any;
  loadingResponse=true;
  public toggleStatus(event){
    if(event.checked==true){
        this.statusValue='ONLINE';
    }else{
         this.statusValue='OFFLINE';
    }

}
  constructor(   private http: HttpService,
  public router: Router, private activatedRoute: ActivatedRoute, ) {
    this.activatedRoute.params.subscribe((params) => {
      this.storeId = params.id;

    })
  }
    
  

  ngOnInit() {
    this.getData();
    for (let i = 0; i < this.languageList.length; i++) {
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
 


  }

  getData(){
    let TEMPURL = 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/cardtemplate_sit/rest/api/v1/gc_template/Get_Templates_By_ID';
    // let TEMPURL = environment.APIBaseURL+'cardtemplate_'+environment.APIBaseProjectName+'/rest/api/v1/gc_template/Get_Templates_By_ID';
    let data = {
      "templateId":this.storeId
    }
    return this.http.postCustomizeJson(TEMPURL, data)
    .subscribe((response) => {
      let value = response;
      this.loadingResponse=false;
      this.ViewJson = response;
      this.keyWords= value['Output']['keywords'];
      this.TemplateData = value['Output']['templates'];
      this.TemplateFor = value['Output']['templateFor'];
      let statusValue = value['Output']['status'];
      if(statusValue == 'ONLINE'){
        this.statusValue = statusValue;
        this.toggleVal = true;
      }else{
        this.statusValue = statusValue;
        this.toggleVal = false;
      }
      // this.toggleStatus(event);
      //  console.log( this.ViewJson);
      
    },
      (error) => {
        // console.log(error);

      });
      
  }
  
}
