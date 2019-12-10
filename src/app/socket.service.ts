import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from './app.service';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  //private url = 'http://localhost:3000';

  private url = 'http://api.essindia.club';

  private socket;

  constructor(public http: HttpClient, public appService: AppService) {
    this.socket = io(this.url);
  }


  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // end events to be listened

  // events to be emitted

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser


  public sendFriendRequest = (data) => {
    this.socket.emit('send-friend-request', data);
  }

  public cancelFriendRequest = (data) => {
    this.socket.emit('cancel-friend-request', data);
  }

  public rejectFriendRequest = (data) => {
    this.socket.emit('reject-friend-request', data);
  }

  public acceptFriendRequest = (data) => {
    this.socket.emit('accept-friend-request', data);
  }

  public sendToReceiverId = (userId) => {

    return Observable.create((observer) => {

      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  }

  public sendToSenderId = (userId) => {

    return Observable.create((observer) => {

      this.socket.on(userId, (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  }

  public sendNotificationRequest = (userId) => {

    //console.log("send-notification-called")

    this.socket.emit('sendMyNotification', userId);
  }

  public getNotification = () => {
    return Observable.create((observer) => {
      this.socket.on('YourNotifications', notificationData => {
        observer.next(notificationData);

      });
    });

  }

  public exitSocket = () => {

    console.log("exit socket called")
    this.socket.disconnect();


  }

  public getAllUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/all?authToken=${authToken}`)
  }

  public getUserDetails(userId, authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${userId}/details?authToken=${authToken}`)
  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleErrorc

}
