import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SocketService } from "./../../socket.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit, OnDestroy {
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public allLists: any = []
  public listName;
  public itemName = '';
  public allItems: any = [];
  public subItems: any = [];
  public editItemName;
  public editListName;
  public addSubItemName;
  public currentItemDetail;
  public currentSubItemDetail;
  public selectedList;
  public selectedListId;
  public selectedListDetail: any;
  public newListName = '';
  public itemDone = '';
  itemSelectedId: any;
  public subItemName = '';
  public subItemDone = '';

  selectedItemId: any;
  selecteditem: any;
  allSubItem: any[];
  public newItemName = '';
  public newItemDone = '';
  public notificationList: any = [];

  public notificationArraySize: any;
  userDetail: any;
  disconnectedSocket: boolean;
  historyToken: any;


  constructor(public appService: AppService, public router: Router, public toastr: ToastrManager, public socketService: SocketService) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userId = Cookie.get('userId');
    this.userName = Cookie.get('fullName');
    this.userDetail = this.appService.getUserInfoFromLocalstorage();

    this.checkStatus();

    this.verifyUserConfirmation()

    this.getAllList();

    setInterval(() => {
      this.socketService.sendNotificationRequest(this.userId);
      this.getMyNotification();
    }, 1000);



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



  public getMyNotification = () => {


    this.socketService.getNotification().subscribe((notificationdata) => {

      this.notificationList = []


      for (let x in notificationdata) {

        if (notificationdata[x].notificationPurpose == "list-Create" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }

          this.notificationList.push(notificationObj)

        } else if (notificationdata[x].notificationPurpose == "list-edit" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "list-delete" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${this.userName} ${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "item-Create" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "item-delete" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${this.userName} ${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "item-edit" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "subItem-Create" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "subItem-delete" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        } else if (notificationdata[x].notificationPurpose == "subItem-edit" && notificationdata[x].notificationStatus == "un-seen") {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage}`,
            details: notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        }
      }

      this.notificationArraySize = this.notificationList.length

    })
  }


  public selectNotification = (notificationId) => {
    this.notificationList.map((notification) => {
      if (notification.details.notificationId == notificationId) {

        this.markNotificationAsSeen(notification.details.notificationId)
        location.reload();
      }
    })
  }


  public markNotificationAsSeen = (notificationId) => {

    this.appService.markNotificationAsSeen(notificationId).subscribe((result) => {
      console.log('result in mark function ', result)
    })
  }


  //functionality of list starts here.

  public createNewList = () => {
    console.log('create new list called')

    this.historyToken = "false";

    let data = {
      listName: this.newListName,
      listCreatorId: this.userId,
      listCreatorName: this.userName,
      listModifierId: this.userId,
      listModifierName: this.userName,
      historyToken: this.historyToken,
      authToken: this.authToken

    }
    this.appService.createNewList(data).subscribe(apiResponse => {
      if (apiResponse.status === 200) {
        this.toastr.successToastr("List Created")
        this.getAllList()
        location.reload();
      } else {
        this.toastr.errorToastr(apiResponse.message)

      }
    }, (error) => {
      this.toastr.errorToastr(error)

    })
  } // end of creating new list.

  public getAllList: any = () => {
    if (this.userId && this.authToken) {
      let data = {
        userId: this.userId,
        authToken: this.authToken
      }
      this.appService.getAllList(data).subscribe((apiResponse) => {
        console.log("apiresponse to get all list is:", apiResponse);
        this.allLists = [];
        if (apiResponse.status === 200) {
          this.allLists = apiResponse.data;
          this.allLists.reverse();
          console.log("all list here is :", this.allLists);
        }
        else {
          this.toastr.errorToastr(apiResponse.message);
          this.allLists.length = 0;
        }
      },
        (error) => {
          this.toastr.errorToastr("Some Error Occurred", "Error!");
        })
    }
    else {
      this.toastr.errorToastr("Missing Authorization Key", "Please login again");
      this.router.navigate(['/']);
    }
  } // end of getAllList function.


  public getListDetails: any = (listId) => {
    console.log('getlistDetails called', listId)

    let data = {
      listId: listId,
      authToken: this.authToken
    }
    this.appService.getListDetail(data).subscribe(apiResponse => {
      this.selectedListDetail = '';
      console.log('list detail here is:', apiResponse)
      if (apiResponse.status === 200) {
        this.selectedListDetail = apiResponse.data
        this.toastr.successToastr('List details fetched')
        console.log(this.selectedListDetail)
      } else {
        this.toastr.errorToastr(apiResponse.message, 'Error')
      }
    }, (error) => {
      this.toastr.errorToastr(error.message, 'Error')
    })
  } // end of getListDetail function.

  public listSelected: any = (listId) => {
    console.log("lisyt id selected", listId)
    Cookie.delete('ListSelectedId');
    this.listName = ''
    this.newItemName = ''
    this.newItemDone = ''
    this.allLists.map((list) => {
      if (list.listId == listId) {
        console.log("list selected is:", list.listId)

        Cookie.set('ListSelectedId', list.listId);
        this.listName = list.listName;
        console.log("list selected is:", this.listName)
      }
    })

  }

  public editList: any = () => {
    if (Cookie.get('ListSelectedId') === undefined || Cookie.get('ListSelectedId') === '' || Cookie.get('ListSelectedId') === null) {
      this.toastr.errorToastr('select a list to edit');
    }
    else {

      this.historyToken = "false";

      let data = {
        listId: Cookie.get('ListSelectedId'),
        listName: this.listName,
        listModifierId: this.userId,
        listModifierName: this.userName,
        historyToken: this.historyToken,
        authToken: this.authToken
      }
      console.log("currentList", data)
      this.appService.editList(data).subscribe(apiResponse => {
        console.log(apiResponse)
        if (apiResponse.status == 200) {
          this.toastr.successToastr('list updated')
          Cookie.delete('ListSelectedId');
          location.reload();
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      }, error => {
        this.toastr.errorToastr(error.message)
      })
    }

  } // end of edit list function.

  public DeleteList(): any {
    if (Cookie.get('ListSelectedId') === undefined || Cookie.get('ListSelectedId') === '' || Cookie.get('ListSelectedId') === null) {
      this.toastr.errorToastr('select a list to delete');
    }
    else {
      let listId = Cookie.get('ListSelectedId');
      console.log("listId to be deleted", listId);
      this.historyToken = "false";
      let data = {
        listId: Cookie.get('ListSelectedId'),
        historyToken: this.historyToken,
        authToken: this.authToken
      }
      this.appService.deleteList(data).subscribe(
        data => {
          this.toastr.successToastr('list deleted.', 'Success!');
          Cookie.delete('ListSelectedId');
          location.reload();
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!')
        }
      )
    }
  } // end of delete list function.

  //functionality of list ends here.

  //functionality of item starts here.

  public getItemsOfList = (listId, listName) => {
    console.log('fetching current list items', listId)
    this.getListDetails(listId)
    this.selectedListId = listId
    this.selectedList = listName
    let data = {
      listId: listId,
      authToken: this.authToken
    }
    this.appService.getAllItemOfList(data).subscribe(apiResponse => {
      console.log("in res cjheck")
      console.log(apiResponse)
      this.allItems = []
      if (apiResponse.status == 200) {

        this.allItems = apiResponse.data
        this.allItems.reverse()
        console.log('allItems', this.allItems)
        this.toastr.successToastr('item details fetched')

      }
    }, (error) => {
      this.toastr.errorToastr(error.message, 'Error')
    })
  }


  public addItem = () => {
    this.historyToken = "false";
    let data = {
      listId: Cookie.get('ListSelectedId'),
      itemName: this.newItemName,
      itemCreatorId: this.userId,
      itemCreatorName: this.userName,
      itemModifierId: this.userId,
      itemModifierName: this.userName,
      itemDone: this.newItemDone,
      historyToken: this.historyToken,
      authToken: this.authToken
    }

    console.log('addItem', data)
    this.appService.addItemToAList(data).subscribe(apiResponse => {
      console.log(apiResponse)

      if (apiResponse.status == 200) {
        this.toastr.successToastr('Item added')
        this.getItemsOfList(Cookie.get('ListSelectedId'), this.listName)
        this.allItems.push(apiResponse.data);
        console.log("all item here is", this.allItems);
        location.reload();

      } else {
        this.toastr.errorToastr(apiResponse.message, 'Error')
      }
    }, (error) => {
      this.toastr.errorToastr(error.message)
    })
  }

  public itemSelected: any = (itemId) => {
    Cookie.delete('ItemSelectedId');
    this.itemName = ''
    this.allItems.map((item) => {
      if (item.itemId == itemId) {
        console.log("item selected is:", item.itemId)

        Cookie.set('ItemSelectedId', item.itemId);
        this.itemName = item.itemName;
        console.log("list selected is:", this.itemName)
        this.getItemDetails(Cookie.get('ItemSelectedId'));
      }
    })


  }

  public DeleteItem(): any {
    if (Cookie.get('ItemSelectedId') === undefined || Cookie.get('ItemSelectedId') === '' || Cookie.get('ItemSelectedId') === null) {
      this.toastr.errorToastr('select an item to delete');
    }
    else {
      let itemId = Cookie.get('ItemSelectedId');
      console.log("itemId to be deleted", itemId);
      this.historyToken = 'false'
      let data = {
        itemId: Cookie.get('ItemSelectedId'),
        historyToken: this.historyToken,
        authToken: this.authToken
      }
      this.appService.deleteItem(data).subscribe(
        data => {
          this.toastr.successToastr('item deleted.', 'Success!');
          Cookie.delete('ItemSelectedId');
          location.reload();
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!')
        }
      )
    }
  } // end of delete item function. 

  public getItemDetails = (itemSelectedId) => {

    console.log("item id selected :", itemSelectedId)
    let data = {
      itemId: itemSelectedId,
      authToken: this.authToken
    }

    this.appService.getItemDetail(data).subscribe(apiResponse => {
      this.currentItemDetail = '';
      if (apiResponse.status === 200) {
        this.currentItemDetail = apiResponse.data
        this.itemDone = apiResponse.data.itemDone
        console.log("current item details are:", this.currentItemDetail)
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, error => {
      this.toastr.errorToastr(error.message)
    })

  }

  public editItem: any = () => {
    if (Cookie.get('ItemSelectedId') === undefined || Cookie.get('ItemSelectedId') === '' || Cookie.get('ItemSelectedId') === null) {
      this.toastr.errorToastr('select an item to edit');
    }
    else {
      this.historyToken = 'false'
      let data = {
        itemId: Cookie.get('ItemSelectedId'),
        itemName: this.itemName,
        itemDone: this.itemDone,
        itemModifierId: this.userId,
        itemModifierName: this.userName,
        historyToken: this.historyToken,
        authToken: this.authToken
      }
      console.log("currentItem", data)
      this.appService.editItem(data).subscribe(apiResponse => {
        console.log(apiResponse)
        if (apiResponse.status == 200) {
          this.toastr.successToastr('item updated')
          Cookie.delete('ItemSelectedId');
          location.reload();
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      }, error => {
        this.toastr.errorToastr(error.message)
      })
    }

  } // end of edit item function.

  //functionality of item ends here.

  //functionality of subItem starts here.


  public addSubItem = () => {
    this.historyToken = 'false'
    let data = {
      itemId: Cookie.get('ItemSelectedId'),
      subItemName: this.subItemName,
      subItemCreatorId: this.userId,
      subItemCreatorName: this.userName,
      subItemModifierId: this.userId,
      subItemModifierName: this.userName,
      subItemDone: this.subItemDone,
      historyToken: this.historyToken,
      authToken: this.authToken
    }

    console.log('addSubItem', data)
    this.appService.addSubItem(data).subscribe(apiResponse => {
      console.log(apiResponse)

      if (apiResponse.status == 200) {
        this.toastr.successToastr('SubItem added')
        this.getItemsOfList(Cookie.get('ListSelectedId'), this.listName)
        for (let x of this.allItems) {
          if (x.itemId == Cookie.get('ItemSelectedId')) {
            x.subItems.push(apiResponse.data)
          }
        }
        console.log("all item with subItem here is", this.allItems)

        console.log("subitem name here is:", this.subItemName)
        console.log("subitem status here is:", this.subItemDone)
        delete this.subItemName
        delete this.subItemDone
        Cookie.delete('ItemSelectedId');
        location.reload();

      } else {
        this.toastr.errorToastr(apiResponse.message, 'Error')
      }
    }, (error) => {
      this.toastr.errorToastr(error.message)
    })
  }

  public subItemSelected: any = (subItemId, itemId) => {
    Cookie.delete('ItemSelectedId');
    Cookie.delete('SubItemSelectedId');
    this.subItemName = ''
    this.itemName = ''
    console.log("all sub items of selected item is:", this.allItems);
    this.allItems.map((item) => {
      if (item.itemId == itemId) {
        console.log("item selected is:", item.itemId)
        Cookie.set('ItemSelectedId', item.itemId);
        this.itemName = item.itemName;
        item.subItems.map((subItem) => {
          if (subItem.subItemId == subItemId) {
            console.log("subItem selected is:", subItem.subItemId)
            Cookie.set('SubItemSelectedId', subItem.subItemId);
            this.subItemName = subItem.subItemName;
            this.subItemDone = subItem.subItemDone
            console.log("subItem selected is:", this.subItemName)
          }
        })
      }
    })

  }

  public getSubItemDetails = (subItemSelectedId, itemSelectedId) => {

    console.log("subItem id selected :", subItemSelectedId)
    console.log("Item id selected :", itemSelectedId)
    let data = {
      itemId: itemSelectedId,
      subItemId: subItemSelectedId,
      authToken: this.authToken
    }
    console.log("itemId here is:", data.itemId)

    this.appService.getSubItemDetail(data).subscribe(apiResponse => {
      this.currentSubItemDetail = '';
      if (apiResponse.status === 200) {
        this.currentSubItemDetail = apiResponse.data
        this.subItemDone = apiResponse.data.subItems.subItemDone
        console.log("current subitem details are:", this.currentSubItemDetail)
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, error => {
      this.toastr.errorToastr(error.message)
    })

  }


  public DeleteSubItem(): any {

    if (Cookie.get('SubItemSelectedId') === undefined || Cookie.get('SubItemSelectedId') === '' || Cookie.get('SubItemSelectedId') === null) {
      this.toastr.errorToastr('select a subItem to delete');
    }
    else {
      let subItemId = Cookie.get('SubItemSelectedId');
      console.log("subItemId to be deleted11111", subItemId);
      this.historyToken = 'false'
      let data = {
        itemId: Cookie.get('ItemSelectedId'),
        subItemId: Cookie.get('SubItemSelectedId'),
        subItemModifierId: this.userId,
        subItemModifierName: this.userName,
        historyToken: this.historyToken,
        authToken: this.authToken
      }

      console.log("itemId here is:", data.itemId)
      console.log("subItemId here is:", data.subItemId)
      this.appService.deleteSubItem(data).subscribe(
        data => {
          this.toastr.successToastr('subItem deleted.', 'Success!');
          Cookie.delete('SubItemSelectedId');
          location.reload();
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!')
        }
      )

      setTimeout(() => {
        console.log("item detail after delete is", this.getItemDetails(Cookie.get('ItemSelectedId')))
      }, 1000);
    }
  } // end of delete item function.


  public editSubItem: any = () => {
    if (Cookie.get('SubItemSelectedId') === undefined || Cookie.get('SubItemSelectedId') === '' || Cookie.get('SubItemSelectedId') === null) {
      this.toastr.errorToastr('select a subItem to edit');
    }
    else {
      this.historyToken = 'false'
      let data = {
        itemId: Cookie.get('ItemSelectedId'),
        subItemId: Cookie.get('SubItemSelectedId'),
        subItemName: this.subItemName,
        subItemDone: this.subItemDone,
        subItemModifierId: this.userId,
        subItemModifierName: this.userName,
        historyToken: this.historyToken,
        authToken: this.authToken
      }
      console.log("currentSubItem is", data)
      this.appService.editSubItem(data).subscribe(apiResponse => {
        console.log(apiResponse)
        if (apiResponse.status == 200) {
          this.toastr.successToastr('subItem updated')
          Cookie.delete('ItemSelectedId');
          Cookie.delete('SubItemSelectedId');
          location.reload();
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      }, error => {
        this.toastr.errorToastr(error.message)
      })
    }

  } // end of edit subItem function.





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



  ngOnDestroy() {
  }
}
