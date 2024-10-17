import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AutheticateService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiUrl}/users/create`, user, { observe: 'response' }).pipe(
      tap((res: HttpResponse<any>) => {
        if (res.status === 201) {
          localStorage.setItem('token', res.body!.token);
          localStorage.setItem('name', res.body!.name);
          localStorage.setItem('email', res.body!.email);
          localStorage.setItem('photo', res.body!.photo!);
        }
        else {
          throw new Error(res.body!.message || 'Unknown error');
        }
      }
    ));
  }

  loginUser(email: string, password: string): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, { email: email, password: password }, { observe: 'response' }).pipe(
      tap((res: HttpResponse<any>) => {
        if (res.status === 200) {
          localStorage.setItem('token', res.body!.token);
          localStorage.setItem('name', res.body!.name);
          localStorage.setItem('email', res.body!.email);
          localStorage.setItem('photo', res.body!.photo!);
        }
        else {
          throw new Error(res.body!.message || 'Unknown error');
        }
      }
    ));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('photo');
  }

}
