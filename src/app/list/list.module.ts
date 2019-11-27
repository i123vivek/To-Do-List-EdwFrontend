import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FriendComponent } from './friend/friend.component';
import { SingleUserComponent } from './single-user/single-user.component';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'single-user', component: SingleUserComponent},
      { path: 'multi-user/:friendId/:friendName', component: MultiUserComponent},
      { path: 'friend', component: FriendComponent}
    ])
  ],
  declarations: [FriendComponent, SingleUserComponent, MultiUserComponent]
})
export class ListModule { }
