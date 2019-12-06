import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from "./../../socket.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  public authToken;
  public userName;
  public userId;
  public allUsers = [];
  public myDetail = [];
  public myFriends = [];
  public friendRequestRecieved = [];
  public friendRequestSent = [];
  public otherUsers= [];
  userDetail: any;
  public friendRequestSents= [];
  disconnectedSocket: boolean;
  public onlineUserList= [];

  constructor(public appService: AppService, public router: Router, public toastr: ToastrManager, public socketService: SocketService) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userName = Cookie.get('fullName')
    this.userId = Cookie.get('userId');
    this.userDetail = this.appService.getUserInfoFromLocalstorage()

    


    this.checkStatus();

    this.verifyUserConfirmation();
    setInterval(() => {
      this.getAllUserDetail()
      this.getMyDetail()
    },1000);
  }


  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public verifyUserConfirmation: any = () => {

    this.socketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;

        this.socketService.setUser(this.authToken);

      });
  }

  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList()
      .subscribe((userList) => {

        this.onlineUserList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x] };

          this.onlineUserList.push(temp);

        }

        console.log(this.onlineUserList);

      }); // end online-user-list
  }

  public getAllUserDetail() {
    this.allUsers = [];
    this.socketService.getAllUsers(this.authToken).subscribe(apiResponse => {
      if (apiResponse.status == 200) {
        this.allUsers = apiResponse.data
      }

    })

  }


  public getMyDetail() {
    this.getAllUserDetail();
    this.socketService.getUserDetails(this.userId, this.authToken).subscribe(apiResponse => {
        if (apiResponse.status === 200) {
          this.myDetail = apiResponse.data
          this.myFriends = apiResponse.data.friends
          this.friendRequestRecieved = apiResponse.data.friendRequestRecieved;
          this.friendRequestSent = apiResponse.data.friendRequestSent;
  
          const filterUserNotInFriendList = this.allUsers.filter((user) => !this.myFriends.find(({friendId}) => user.userId === friendId));
  
          const filterUserNotInFriendRequestReceived = filterUserNotInFriendList.filter((user) => ! this.friendRequestRecieved.find(({friendId}) => user.userId === friendId));
          //console.log("filtered User not in friend request received are:", filterUserNotInFriendRequestReceived);
  
          const filterUserNotInFriendRequestsent = filterUserNotInFriendRequestReceived.filter((user) => ! this.friendRequestSent.find(({friendId}) => user.userId === friendId));
          //console.log("filtered User not in friend request sent are:", filterUserNotInFriendRequestsent);
  
          this.otherUsers = filterUserNotInFriendRequestsent.filter(user =>user.userId !== this.userId);
          //console.log("all users not in friend list are:", this.otherUsers)
        } else {
          //this.toastr.errorToastr(apiResponse.message)
        }
      //},1000);
      
    }, error => {
      //this.toastr.errorToastr(error.message)
    })
  }





  public addFriend(userId, firstName) {
    if (this.userId === undefined || this.userId === '' || this.userId === null || this.userName === undefined || this.userName === '' || this.userName === null || userId === undefined || userId === '' || userId === null || firstName === undefined || firstName === '' || firstName === null || this.authToken === undefined || this.authToken === '' || this.authToken === null){
      this.toastr.errorToastr(" some argument is missing")
    } else{
      let data = {
        senderId: this.userId,
        senderName: this.userName,
        recieverId: userId,
        recieverName: firstName,
        authToken: this.authToken
      }
      console.log("data for sending friend request", data)
      this.socketService.sendFriendRequest(data)
      // this.getAllUserDetail()
      // this.getMyDetail()
      // setInterval(() => {
      //   this.getAllUserDetail()
      //   this.getMyDetail()
      //   this.socketService.sendToReceiverId(data.recieverId);
      // },1000);
      

    }
    
  }

  public cancelFriendRequest(userId, userName) {
    if (this.userId === undefined || this.userId === '' || this.userId === null || this.userName === undefined || this.userName === '' || this.userName === null || userId === undefined || userId === '' || userId === null || userName === undefined || userName === '' || userName === null || this.authToken === undefined || this.authToken === '' || this.authToken === null){
      this.toastr.errorToastr(" some argument is missing")
    } else{
      let data = {
        senderId: this.userId,
        senderName: this.userName,
        recieverId: userId,
        recieverName: userName,
        authToken: this.authToken
      }

      console.log("data for cancelling friend request is:", data);
      this.socketService.cancelFriendRequest(data)
      
      // setInterval(() => {
      //   this.getAllUserDetail()
      //   this.getMyDetail()
      //   this.socketService.sendToReceiverId(data.recieverId);
      // },1000);
    }
    
  }


  // public cancelFriendRequest(userId, userName) {
  //   let data = {
  //     senderId: this.userId,
  //     senderName: this.userName,
  //     recieverId: userId,
  //     recieverName: userName,
  //     authToken: this.authToken
  //   }

  //   console.log("data for cancelling friend request is:", data);

  //   this.appService.cancelFriendRequest(data).subscribe(apiResponse => {
  //     console.log(" apiResponse for cancelling friend requesst is:", apiResponse)
  //     if (apiResponse.status === 200) {
  //       this.toastr.successToastr('friend request cancel')
  //       this.getMyDetail()
  //       this.getAllUserDetail()

  //     } else {
  //       this.toastr.errorToastr(apiResponse.message)
  //     }
  //   }, error => {
  //     this.toastr.errorToastr(error.message);
  //   })
  // }


  // public rejectFriendRequest(friendId, friendName) {
  //   let data = {
  //     senderId: friendId,
  //     senderName: friendName,
  //     recieverId: this.userId,
  //     recieverName: this.userName,
  //     authToken: this.authToken
  //   }

  //   console.log("data for reject friend request is:", data);

  //   this.appService.rejectFriendRequest(data).subscribe(apiResponse => {
  //     console.log("apiResponse for rejecting friend request is:", apiResponse)
  //     if (apiResponse.status === 200) {
  //       this.toastr.successToastr('friend request rejected')
  //       this.getMyDetail()
  //       this.getAllUserDetail()

  //     } else {
  //       this.toastr.errorToastr(apiResponse.message)
  //     }
  //   }, error => {
  //     this.toastr.errorToastr(error.message);
  //   })
  // }

  public rejectFriendRequest(friendId, friendName) {

    if (this.userId === undefined || this.userId === '' || this.userId === null || this.userName === undefined || this.userName === '' || this.userName === null || friendId === undefined || friendId === '' || friendId === null || friendName === undefined || friendName === '' || friendName === null || this.authToken === undefined || this.authToken === '' || this.authToken === null){
      this.toastr.errorToastr(" some argument is missing")
    } else{
      let data = {
        senderId: friendId,
        senderName: friendName,
        recieverId: this.userId,
        recieverName: this.userName,
        authToken: this.authToken
      }

      console.log("data for rejecting friend request is:", data);
      this.socketService.rejectFriendRequest(data)
      
      // setInterval(() => {
      //   this.getAllUserDetail()
      //   this.getMyDetail()
      //   this.socketService.sendToSenderId(data.senderId);
      // },1000);
    }

    // let data = {
    //   senderId: friendId,
    //   senderName: friendName,
    //   recieverId: this.userId,
    //   recieverName: this.userName,
    //   authToken: this.authToken
    // }

    // console.log("data for reject friend request is:", data);

    // this.appService.rejectFriendRequest(data).subscribe(apiResponse => {
    //   console.log("apiResponse for rejecting friend request is:", apiResponse)
    //   if (apiResponse.status === 200) {
    //     this.toastr.successToastr('friend request rejected')
    //     this.getMyDetail()
    //     this.getAllUserDetail()

    //   } else {
    //     this.toastr.errorToastr(apiResponse.message)
    //   }
    // }, error => {
    //   this.toastr.errorToastr(error.message);
    // })
  }

  public acceptFriendRequest(friendId, friendName) {

    if (this.userId === undefined || this.userId === '' || this.userId === null || this.userName === undefined || this.userName === '' || this.userName === null || friendId === undefined || friendId === '' || friendId === null || friendName === undefined || friendName === '' || friendName === null || this.authToken === undefined || this.authToken === '' || this.authToken === null){
      this.toastr.errorToastr(" some argument is missing")
    } else{
      let data = {
        senderId: friendId,
        senderName: friendName,
        recieverId: this.userId,
        recieverName: this.userName,
        authToken: this.authToken
      }

      console.log("data for accepting friend request is:", data);
      this.socketService.acceptFriendRequest(data)
      
      // setTimeout(() => {
      //   this.getMyDetail();
      // }, 500);
    }
  }

  // public acceptFriendRequest(friendId, friendName) {
  //   let data = {
  //     senderId: friendId,
  //     senderName: friendName,
  //     recieverId: this.userId,
  //     recieverName: this.userName,
  //     authToken: this.authToken
  //   }

  //   console.log("data for accepting friend request is :", data);

  //   this.appService.acceptFriendRequest(data).subscribe(apiResponse => {
  //     console.log("apiResponse for accepting friend request is:", apiResponse);
  //     if (apiResponse.status === 200) {
  //       this.toastr.successToastr('friend request accepted')
  //       this.getMyDetail()
  //     } else {
  //       this.toastr.errorToastr(apiResponse.message)
  //     }
  //   }, error => {
  //     this.toastr.errorToastr(error.message)
  //   })
  // }



  public logout: any = () => {

    this.appService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.deleteAll();
          this.socketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.toastr.errorToastr(apiResponse.message)

        } // end condition

      }, (err) => {
        this.toastr.errorToastr('some error occured')
      });

  } // end logout

}
