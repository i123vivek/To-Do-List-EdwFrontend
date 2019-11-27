import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email : any;
  public password: any;

  constructor(public router:Router, public appService:AppService, public toastr: ToastrManager) { }

  ngOnInit() {
  }

  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public goToSignUp: any = () =>{
    this.router.navigate(['/signup']);
  }

  public goToSignIn: any = ()=>{
    if (!this.email) {
      this.toastr.warningToastr('enter email')
    } else if (!this.password) {
      this.toastr.warningToastr('enter password')
    } else{
      let data = {
        email: this.email,
        password: this.password
      }
      console.log('login data is:',data);
      this.appService.signinFunction(data).subscribe((apiResponse) =>{

        if(apiResponse.status === 200){
          console.log('apiResponse for login is:', apiResponse);

          Cookie.set('authToken', apiResponse.data.authToken);

          Cookie.set('userId', apiResponse.data.userDetails.userId);

          Cookie.set('email', apiResponse.data.userDetails.email);

          Cookie.set('fullName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);

          this.router.navigate(['/single-user'])
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      },(err) => {
        this.toastr.errorToastr('some error occured')
      })
    }
  }

  public forgotPasswordFunction = () =>{
    if(this.validateEmail(this.email)){
      this.appService.getResetLink(this.email).subscribe((apiResponse) =>{
        if(apiResponse.status === 200){
          this.toastr.successToastr('check your email for the link')
        } else{
          this.toastr.errorToastr('some error occured or userdetails not found')
        }
      },(err) =>{
        this.toastr.errorToastr('some error occured')
      });
    } else{
      this.toastr.errorToastr('Enter a valid email')
      console.log("forgot password function :- Enter a valid email")
    }
  }

}
