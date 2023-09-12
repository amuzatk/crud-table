import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/users';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  @Input() dialogHeader: string = 'Create User';
  @Input() user: User | null = null;
  @Input() userForm: FormGroup;


  @Output() saveUserEvent = new EventEmitter<User>();
  @Output() cancelEditEvent = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
    });
  }

  onSaveUser() {
    if (this.userForm.valid) {
      const userToSave = this.userForm.value;
      this.saveUserEvent.emit(userToSave);
    }
  }
}
