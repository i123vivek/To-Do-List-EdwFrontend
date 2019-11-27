import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'login', component: LoginComponent},
      { path:'signup', component: SignupComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
