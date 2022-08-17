import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import{HttpService} from '../../../../services/http-service';

import { FormControl, FormGroup, Validators, FormBuilder, NgForm, FormGroupDirective } from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'clientOnBoarding',
  templateUrl: './clientOnBoarding.component.html',
  styleUrls: ['./clientOnBoarding.component.scss']
})
export class clientOnBoardingComponent implements OnInit {

  
//   public loginFormGroup:FormGroup;
//   public matcher = new MyErrorStateMatcher();
  constructor( 
     private router: Router,
     private https:HttpClient, 
     private fb: FormBuilder,
     private http:HttpService) { 
    
  }

   ngOnInit() {
   }
   
   hitservice(){

     let user ={
      "userName" : "jogeswar8",
      "firstName" : "Jogeswar",
      "lastName" : "Sahu",
      "phoneNumber" : "7338552253",
      "roleId" : "1",
      "emailId" : "jj@gmail.com",
      "employeeId" : "785",
      "title" : "MR",
      "status" : "ONLINE"
    }
     this.http.postJson("http://192.168.2.48:9090/api/rpa/user/save",user).subscribe(
         response =>{
         },

         err=>{          
         }
     )

   }


}
