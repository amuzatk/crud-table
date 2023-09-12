// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-user-list',
//   templateUrl: './user-list.component.html',
//   styleUrls: ['./user-list.component.css']
// })
// export class UserListComponent {

// }

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../models/users';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<number | string>();

  constructor() {}

  ngOnInit() {}

  onEditUser(user: User) {
    this.editUser.emit(user);
  }

  onDeleteUser(userId: number | string) {
    this.deleteUser.emit(userId);
  }
}
