import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-role-tier-qualifications',
  templateUrl: './role-tier-qualifications.component.html',
  styleUrls: ['./role-tier-qualifications.component.scss']
})
export class RoleTierQualificationsComponent implements OnInit {

  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Loyalty",
      link: ""
    },
    {
      title: "Role-Tier Qualifications",
      link: ""
    }
  ];

  roleTierFormGroup:FormGroup;
  currencyList:any=['AED','USD'];

  constructor(private fb: FormBuilder) { 
    this.builfRoleTierForm();
  }

  ngOnInit() {
  }

  public builfRoleTierForm(){
    let form = {
      activeDays : ['',Validators.required],
      minValue:['',Validators.required],
      maxValue:['',Validators.required]
     }
     this.roleTierFormGroup = this.fb.group(form);
  }
  public addRoleTier(formdata){

  }
}
