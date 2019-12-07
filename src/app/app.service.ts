import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  //private url = 'http://localhost:3000';
  private url = 'http://api.bhaiyaji.club';

  constructor(public http: HttpClient) { }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('country', data.country);
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/users/login`, params)
  }

  public getResetLink(email): Observable<any> {
    console.log("came inside resetlink fn: ", email);
    const params = new HttpParams()
      .set('email', email)
    return this.http.post(`${this.url}/api/v1/users/forgot/password`, params)

  }

  public setNewPassword(password, token): Observable<any> {
    const params = new HttpParams()
      .set('newPassword', password)
    return this.http.post(`${this.url}/api/v1/users/reset/${token}`, params)
  }

  public getAllUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/all?authToken=${authToken}`);
  }

  public getUserDetails(userId, authToken): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${userId}/details?authToken=${authToken}`);
  }



  // for friend.

  public getAllRequestSent(data): Observable<any> {
    return this.http.get(`${this.url}/api/v1/friends/view/${data.userId}/friend/request/sent?authToken=${data.authToken}`)
  }

  public getAllRequestReceived(data): Observable<any> {
    return this.http.get(`${this.url}/api/v1/friends/view/${data.userId}/friend/request/recieved?authToken=${data.authToken}`)
  }

  public sendFriendRequest(data): Observable<any> {

    const params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('recieverId', data.recieverId)
      .set('recieverName', data.recieverName)
    //.set('authToken', data.authToken)
    return this.http.post(`${this.url}/api/v1/friends/send/friend/request?authToken=${data.authToken}`, params);
  }

  public rejectFriendRequest(data): Observable<any> {

    const params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('recieverId', data.recieverId)
      .set('recieverName', data.recieverName)
    //.set('authToken', data.authToken)
    return this.http.post(`${this.url}/api/v1/friends/reject/friend/request?authToken=${data.authToken}`, params);
  }


  public cancelFriendRequest(data): Observable<any> {

    const params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('recieverId', data.recieverId)
      .set('recieverName', data.recieverName)
    //.set('authToken', data.authToken)
    return this.http.post(`${this.url}/api/v1/friends/cancel/friend/request?authToken=${data.authToken}`, params);
  }

  public acceptFriendRequest(data): Observable<any> {

    const params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('recieverId', data.recieverId)
      .set('recieverName', data.recieverName)
    //.set('authToken', data.authToken)


    return this.http.post(`${this.url}/api/v1/friends/accept/friend/request?authToken=${data.authToken}`, params);
  }

  public unfriendUser(data): Observable<any> {

    const params = new HttpParams()
      .set('senderId', data.senderId)
      .set('senderName', data.senderName)
      .set('recieverId', data.recieverId)
      .set('recieverName', data.recieverName)
    //.set('authToken', data.authToken)

    return this.http.post(`${this.url}/api/v1/friends/unfriend/user?authToken=${data.authToken}`, params);
  }


  // for list.

  public createNewList(data: any): Observable<any> {
    const params = new HttpParams()
      .set('listName', data.listName)
      .set('listCreatorId', data.listCreatorId)
      .set('listCreatorName', data.listCreatorName)
      .set('listModifierId', data.listModifierId)
      .set('historyToken', data.historyToken)
      .set('listModifierName', data.listModifierName)

    //.set('authToken', data.authToken)

    return this.http.post(`${this.url}/api/v1/lists/createList?authToken=${data.authToken}`, params)
  }

  public getAllList(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/lists/view/all/${data.userId}/lists?authToken=${data.authToken}`)
  }

  public getListDetail(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/lists/${data.listId}/details?authToken=${data.authToken}`)
  }

  public editList(data: any): Observable<any> {

    const params = new HttpParams()
      .set('listName', data.listName)
      .set('listModifierId', data.listModifierId)
      .set('historyToken', data.historyToken)
      .set('listModifierName', data.listModifierName)
    //.set('authToken', data.authToken)

    return this.http.put(`${this.url}/api/v1/lists/${data.listId}/editList?authToken=${data.authToken}`, params);
  }



  public deleteList(data: any): Observable<any> {

    const params = new HttpParams()
      .set('listId', data.listId)
      .set('historyToken', data.historyToken)

    return this.http.post(`${this.url}/api/v1/lists/${data.listId}/delete?authToken=${data.authToken}`, params);
  }


  // for item.
  public getAllItemOfList(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/items/view/all/${data.listId}/items?authToken=${data.authToken}`)
  }

  public addItemToAList(data: any): Observable<any> {
    const params = new HttpParams()
      .set('listId', data.listId)
      .set('itemName', data.itemName)
      .set('itemCreatorId', data.itemCreatorId)
      .set('itemCreatorName', data.itemCreatorName)
      .set('itemModifierId', data.itemModifierId)
      .set('itemDone', data.itemDone)
      .set('itemModifierName', data.itemModifierName)
      .set('historyToken', data.historyToken)
    //.set('authToken', data.authToken)

    return this.http.post(`${this.url}/api/v1/items/add/item?authToken=${data.authToken}`, params)
  }

  public deleteItem(data: any): Observable<any> {
    const params = new HttpParams()
      .set('authToken', data.authToken)
      .set('historyToken', data.historyToken)
    return this.http.post(`${this.url}/api/v1/items/${data.itemId}/delete`, params)
  }

  public getItemDetail(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/items/${data.itemId}/details?authToken=${data.authToken}`)
  }

  public editItem(data: any): Observable<any> {
    const params = new HttpParams()
      .set('itemName', data.itemName)
      .set('itemDone', data.itemDone)
      .set('itemModifierId', data.itemModifierId)
      .set('itemModifierName', data.itemModifierName)
      .set('historyToken', data.historyToken)
    return this.http.put(`${this.url}/api/v1/items/${data.itemId}/update/item?authToken=${data.authToken}`, params)
  }

  //  for subItem.
  public addSubItem(data: any): Observable<any> {
    const params = new HttpParams()
      .set('subItemName', data.subItemName)
      .set('subItemDone', data.subItemDone)
      .set('subItemCreatorId', data.subItemCreatorId)
      .set('subItemCreatorName', data.subItemCreatorName)
      .set('subItemModifierId', data.subItemModifierId)
      .set('subItemModifierName', data.subItemModifierName)
      .set('historyToken', data.historyToken)

    return this.http.put(`${this.url}/api/v1/subItems/${data.itemId}/add/subItem?authToken=${data.authToken}`, params)
  }

  public getSubItemDetail(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/subItems/${data.itemId}/${data.subItemId}/details?authToken=${data.authToken}`)
  }

  public editSubItem(data): Observable<any> {

    const params = new HttpParams()
      .set('subItemId', data.subItemId)
      .set('subItemName', data.subItemName)
      .set('subItemModifierId', data.subItemModifierId)
      .set('subItemModifierName', data.subItemModifierName)
      .set('subItemDone', data.subItemDone)
      .set('historyToken', data.historyToken)
    //.set('authToken', data.authToken)

    return this.http.put(`${this.url}/api/v1/subItems/${data.itemId}/edit/subItem?authToken=${data.authToken}`, params);
  }


  public deleteSubItem(data): Observable<any> {
    console.log("data to delete", data)
    const params = new HttpParams()
      .set('subItemId', data.subItemId)
      .set('authToken', data.authToken)
      .set('subItemModifierId', data.subItemModifierId)
      .set('subItemModifierName', data.subItemModifierName)
      .set('historyToken', data.historyToken)

    return this.http.put(`${this.url}/api/v1/subItems/${data.itemId}/delete/subItem`, params);
  }

  public markNotificationAsSeen = (notificationId) => {

    return this.http.get(`${this.url}/api/v1/notifications/mark/notification/seen?notificationId=${notificationId}&authToken=${Cookie.get('authToken')}`)

  }

  public deleteHistory(data: any): Observable<any> {

    const params = new HttpParams()
      .set('historyId', data.historyId)

    return this.http.post(`${this.url}/api/v1/history/${data.historyId}/delete?authToken=${data.authToken}`, params);
  }

  public getAllHistoryOfAUser(data: any): Observable<any> {
    return this.http.get(`${this.url}/api/v1/history/view/all/${data.userId}/history?authToken=${data.authToken}`)
  }




  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }



  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  }
}
