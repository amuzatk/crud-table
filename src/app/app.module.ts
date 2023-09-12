import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component'
import { UserListComponent } from './user-list/user-list.component'


import { UserFormComponent } from './user-form/user-form.component';
@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    LoadingSpinnerComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    TableModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
