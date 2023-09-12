import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from './models/users';
import { UserService } from './user.service';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class AppComponent implements OnInit {
  title = 'stackbuld-task';
  loading = false;
  userForm: FormGroup;
  selectedUserForEdit: User | null = null;
  userDialog = false;
  dialogHeader = 'Create User';
  submitted = false;
  editSelectedUser: User | null = null;
  editUserDialog = false; 

  isCreatingUser = false;
  showFormView = false;

  @ViewChild('dt', { static: false }) dt!: Table;
  users: User[] = [];
  formViewVisible = false;
  username: string = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users. Please try again later.',
          life: 3000,
        });
        this.loading = false;
      }
    );
  }

  getDialogHeader(): string {
    return this.isCreatingUser ? 'Create User' : 'Edit User';
  }
  openNew() {
    this.selectedUserForEdit = null;
    this.userForm.reset();
    this.userForm.markAsUntouched();
    this.dialogHeader = 'Create User';
    this.formViewVisible = true;
  }

  editUser(user: User) {
    if (user && user.name && user.email && user.username) {
      this.selectedUserForEdit = { ...user };
      const { firstname, lastname } = user.name;
      const { email, username } = user;

      this.userForm.patchValue({
        firstname,
        lastname,
        email,
        username,
      });
      this.isCreatingUser = false;
      this.dialogHeader = 'Edit User';
      this.formViewVisible = true;
    }
  }
  onDialogHide() {
    this.formViewVisible = false;
  }

  deleteUser(postId: number | string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(postId).subscribe(() => {
        this.users = this.users.filter((post) => post.id !== postId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000,
        });
      });
    }
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  showForm() {
    this.showFormView = true;
  }

  saveUser(newUser: User) {
    this.submitted = true;
    const formValues = this.userForm.value;

    if (this.selectedUserForEdit) {
      this.selectedUserForEdit.name.firstname = formValues.firstname;
      this.selectedUserForEdit.name.lastname = formValues.lastname;
      this.selectedUserForEdit.email = formValues.email;
      this.selectedUserForEdit.username = formValues.username;

      this.userService.updateUser(this.selectedUserForEdit).subscribe((updatedUser) => {
        const index = this.findIndexById(updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'User Updated',
            life: 3000,
          });
        }
      });
    } else {
      const newUser: User = {
        id: this.createId(),
        email: formValues.email,
        username: formValues.username,
        password: '',
        name: {
          firstname: formValues.firstname,
          lastname: formValues.lastname,
        },
        address: {
          city: '',
          street: '',
          number: 0,
          zipcode: '',
          geolocation: {
            lat: '',
            long: '',
          },
        },
        phone: '',
      };

      this.userService.addUser(newUser).subscribe((createdUser) => {
        this.users.push(createdUser);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Created',
          life: 3000,
        });
      });
    }

    this.users = [...this.users];
    this.editUserDialog = false;
    this.selectedUserForEdit = null;
    this.userForm.reset();
    this.formViewVisible = false;
  }

  cancelEdit() {
    this.formViewVisible = false;
    this.editUserDialog = false;
  }

  findIndexById(id: string | number): number {
    return this.users.findIndex((user) => user.id === id);
  }

  createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
    }
  }
}