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

// function _window() : any {
//   // return the global native browser window object
//   return window;
// }


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://localhost:3000';

  private socket;
  //allUserId: any[];
  //authToken = Cookie.get('authToken');

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

  
  public sendFriendRequest= (data)=>{
    this.socket.emit('send-friend-request', data);
  }

  public cancelFriendRequest = (data) =>{
    this.socket.emit('cancel-friend-request', data);
  }

  public rejectFriendRequest = (data) =>{
    this.socket.emit('reject-friend-request', data);
  }

  public acceptFriendRequest = (data)=>{
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
    //console.log("get-notification-called")
    return Observable.create((observer) => {
      this.socket.on('YourNotifications', notificationData => {
        observer.next(notificationData);
        //console.log("notifiation recieved from the server is:", notificationData);

      });
    });

  }

  public exitSocket = () => {

    console.log("exit socket called")
    this.socket.disconnect();


  }

  public getAllUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/all?authToken=${authToken}`)
      //.do(data => console.log('Data received for all user details'))
      //.catch(this.handleError);
  }

  public getUserDetails(userId, authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${userId}/details?authToken=${authToken}`)
      //.do(data => console.log('Data received for single user detail'))
      //.catch(this.handleError);
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

  }  // END handleError




  // public getvarname = (idx) => {
  //   let alluser = [];
  //   let value=_window()+idx
  //   return value
    
  // }
  
  
  // public getAllUserId() {
  //   this.allUserId = [];
  //   this.appService.getAllUsers(this.authToken).subscribe(apiResponse => {
  //     console.log('apiResponse.data',)
  //     const data =apiResponse.data
  //     this.allUserId = [];
  //     if (apiResponse.status == 200) {
  //       // const window = (idx) => {return _window()+idx }
  //       // console.log('api, ', (apiResponse.data),  apiResponse.data.userId)
  //       // apiResponse.data.forEach()
  //       try {
  //         for(let x in data){
  //           console.log("value of x is", x)
  //           let temp = {
  //             index: x,
  //             userId: data[x].userId
  //           }
            
  //           //console.log('num', this.getvarname(temp['index']));
  //           // let dicts = {}
  //           // var num = new Number(index); 
  //           // let valu = this.getvarname(num.toString()) ;
  //           // console.log('crlient i',  value[index]);
  //           this.allUserId.push(temp);
  //         }
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     }
  //     console.log("all user details are:", this.allUserId)

  //   })

  // }
  





  //   // return false;

  

  // public verifyUser = () => {
  //   this.getAllUserId()

  //   return Observable.create((observer) => {
  //     this.socket.on('verifyUser', (data) => {
  //       observer.next(data);
  //     });//On method
  //   });//end observable
  // }//end verifyUser


  // public setUser = (authToken) => {
  //   console.log("setting user")
  //   this.socket.emit('set-user', authToken);
  // } // end setUser


  // public emitSendFriendRequest = (data) => {
  //   this.socket.emit('send-friend-request', data);
  //   console.log("data on emitting send friend request inside socket is: ", data);
  // }

  // public onSendFriendRequest = () => {
  //   return Observable.create((observer) => {
  //     console.log("onSendFriendRequest function called")
  //     this.socket.on('notify-about-request', (data) => {
  //       console.log("data on listining in socket service on sending request:", data)
  //       observer.next(data);
  //     })
  //   })
  // } //end of on send friend request

  // // public emitAcceptRequest = (data: any) => {
  // //   this.socket.emit('accept-request', data);
  // // }//end of emit cancel request

  // // public onAcceptFriendRequest = () => {
  // //   return Observable.create((observer) => {
  // //     this.socket.on('request-accepted', (data) => {
  // //       observer.next(data);
  // //     })
  // //   })
  // // } //end of on accept friend request

  // // public emitCancelRequest = (userId: any) => {
  // //   this.socket.emit('cancel-request', userId);
  // // }//end of emit cancel request

  // // public onCancelFriendRequest = () => {
  // //   return Observable.create((observer) => {
  // //     this.socket.on('update-cancel-request', (userId) => {
  // //       observer.next(userId);
  // //     })
  // //   })
  // // }//end of on cancel friend request

  // // public onDecrementReqCount = () => {
  // //   return Observable.create((observer) => {
  // //     this.socket.on('decrement-request-count', (data) => {
  // //       observer.next(data);
  // //     })
  // //   })
  // // }


  // //events to be emitted


  




  
}
