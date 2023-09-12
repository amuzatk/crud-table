import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from './models/users';
import { UserService } from './user.service';
import { Table } from 'primeng/table'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, trigger, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService, ConfirmationService],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('2000ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'stackbuld-task';
  loading = false;
  showFormView = false;
  userForm: FormGroup;
  selectedUserForEdit: User | null = null;
  isCreatingUser: boolean = false;
  dialogHeader: string = 'Create User'; 

  @ViewChild('dt', { static: false })
  dt!: Table; 
  userDialog: boolean = false;
  editUserDialog: boolean = false;
  users!: User[];
  formViewVisible = false;
  
  user: User = {
    id: '',
    email: '',
    username: '',
    password: '',
    name: {
      firstname: '',
      lastname: ''
    },
    address: {
      city: '',
      street: '',
      number: 0,
      zipcode: '',
      geolocation: {
        lat: '',
        long: ''
      }
    },
    phone: ''
  };
  selectedUsers!: User[] | null;
  submitted: boolean = false;

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
  getUsers(): void{
    this.loading = true; 
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.loading = false; 
      },
      (error) => {
        console.error('Error fetching users:', error);
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
    this.editUserDialog = true;
    this.isCreatingUser = true; // Set the flag to indicate you are creating a new user
    this.formViewVisible = true;
    this.dialogHeader = 'Create User'; // Set the dialog header to "Create User"
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.dt) {
          this.users = this.users.filter((val) => !this.selectedUsers?.includes(val));
          this.selectedUsers = null;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
        }
      }
    });
  }

  editUser(user: User) {
    if (user && user.name && user.email && user.username) {
      this.selectedUserForEdit = { ...user };
      this.userForm.patchValue({
        firstname: user.name.firstname,
        lastname: user.name.lastname,
        email: user.email,
        username: user.username,
      });
      this.formViewVisible = true;
      this.editUserDialog = true;
      this.isCreatingUser = false; 
      this.dialogHeader = 'Edit User'; 
    }
  }
  
  onDialogHide() {
    setTimeout(() => {
    this.formViewVisible = false;
    }, 3000);
  }

  cancelEdit() {
    this.formViewVisible = false;
    setTimeout(() => {
      this.editUserDialog = false;
    }, 300);
  }
  

  deleteUser(postId: number | string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(postId).subscribe(() => {
        this.users = this.users.filter((post) => post.id !== postId);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'User Deleted',
          life: 3000
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
  saveUser() {
    this.submitted = true;
    const formValues = this.userForm.value;
  
    if (this.selectedUserForEdit) {
      // Update user
      this.selectedUserForEdit.name.firstname = formValues.firstname;
      this.selectedUserForEdit.name.lastname = formValues.lastname;
      this.selectedUserForEdit.email = formValues.email;
      this.selectedUserForEdit.username = formValues.username;
  
      this.userService.updateUser(this.selectedUserForEdit).subscribe((updatedUser) => {
        const index = this.findIndexById(updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        }
      });
    } else {
      // Create user
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
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
      });
    }
  
    this.users = [...this.users];
    this.editUserDialog = false;
    this.selectedUserForEdit = null;
    this.userForm.reset();
  }
  
  findIndexById(id: string | number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
    }
  }  
}
