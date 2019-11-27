import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { SocketService } from './socket.service';
import { ListModule } from './list/list.module';

@NgModule({
  declarations: [
    AppComponent,
    ResetPasswordComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    UserModule,
    ListModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'reset/:token', component: ResetPasswordComponent},
      { path: 'home', component: HomeComponent, pathMatch: 'full'},
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: '*', component: HomeComponent},
      { path: '**', component: HomeComponent},
      
    ])
  ],
  providers: [AppService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
