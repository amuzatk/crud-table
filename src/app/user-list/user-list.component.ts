import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<number | string>();
  @Output() openNewEvent = new EventEmitter<void>();
  selectedUserForEdit: User | null = null;
  userForm: FormGroup;
  dialogHeader = 'Create User';
  formViewVisible = false;
  loading = false;


  constructor(
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
    });
  }

  ngOnInit() {}

  openNew() {
    this.selectedUserForEdit = null;
    this.userForm.reset();
    this.userForm.markAsUntouched();
    this.dialogHeader = 'Create User';
    this.formViewVisible = true;
    this.openNewEvent.emit();
  }
  
  onEditUser(user: User) {
    this.editUser.emit(user);
  }

  onDeleteUser(userId: number | string) {
    this.deleteUser.emit(userId);
  }
}
