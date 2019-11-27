import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager }  from 'ng6-toastr-notifications';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public country: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrManager) { }

  ngOnInit() {
  }

  public goToSignIn: any = () =>{
    this.router.navigate(['/login']);
  } // end of goToSignIn function.

  public signupFunction: any =()=>{
    if(!this.firstName){
      this.toastr.warningToastr('enter the first name');
    } else if(!this.lastName){
      this.toastr.warningToastr('enter the last name');
    } else if(!this.mobileNumber){
      this.toastr.warningToastr('enter mobile number');
    } else if(!this.email){
      this.toastr.warningToastr('enter email');
    } else if(!this.password){
      this.toastr.warningToastr('enter password');
    } else if(!this.country){
      this.toastr.warningToastr('enter country');
    } else{
      let data ={
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password,
        country: this.country
      }

      console.log("The data for signup is:",data);
      this.appService.signupFunction(data).subscribe((apiResponse) =>{
        console.log("the apiResponse for signup is:",apiResponse);

        if (apiResponse.status === 200){
          this.toastr.successToastr('Signup successful');
          setTimeout(() => {
            this.goToSignIn();
          }, 2000);
        }
        else {
          this.toastr.errorToastr(apiResponse.message);
        }
      }, (err) => {
        this.toastr.errorToastr('some error occured');
      });
    }
  }

}
