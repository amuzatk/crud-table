import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((error: any) => {
        console.error('Error adding user:', error);
        return throwError(error);
      }),
      map((response: any) => {
        if (response && response.id) {
          return response as User;
        } else {
          throw new Error('Invalid response from the server');
        }
      })
    );
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user).pipe(
      catchError((error: any) => {
        console.error('Error updating user:', error);
        return throwError(error);
      }),
      map((response: any) => {
        if (response && response.id) {
          return response as User;
        } else {
          throw new Error('Invalid response from the server');
        }
      })
    );
  }

  deleteUser(id: number | string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
