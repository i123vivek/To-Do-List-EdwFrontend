import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password: string;
  public duplicatePassword: string;
  public route: any;
  public token: string;

  constructor(public toastr: ToastrManager, public router: Router, private activatedRoute: ActivatedRoute, public appService: AppService) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
    });
   }

  ngOnInit() {
    //console.log((window.location.href))
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    console.log("the token is", this.token)
    console.log((this.router.url))
  }

  public comparePassword = (password1, password2) => {
    if (password1 === password2) {
      return true;
    }
    else {
      return false;
    }
  }

  public setNewPassword =()=>{
    let password1 = this.password;
    let password2 = this.duplicatePassword;

    if(this.comparePassword(password1,password2) === true) {
      this.appService.setNewPassword(password1,this.token).subscribe((apiResponse) =>{
        console.log('apiResponse for set new password',apiResponse);
        if(apiResponse.status === 200){
          this.toastr.successToastr('password set successfully');
          this.router.navigate(['/login']);
        } else {
          this.toastr.errorToastr('Some error occurred or token expired');
        }
      },(err)=>{
        this.toastr.errorToastr('some error occured');
      })
    } else{
      this.toastr.warningToastr('passwords mismatch ');
    }
  }

}
