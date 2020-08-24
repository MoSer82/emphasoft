import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment';

const TOKEN = 'empha_token';
const USERNAME = 'empha_username';

export interface User {
  id:	number;
  username:	string;
  first_name:	string;
  last_name: string;
  password:	string;
  is_active: boolean;
  last_login:	string;
  is_superuser:	boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService implements Resolve<User> {

  private userData: User;
  private usersList: User[];
  private apiUrl = environment.apiUrl;
  public userToken: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  resolve(): Observable<User> {
    const userSubject = new Subject();
    if (!this.userData && this.username) {
      this.getUsers().subscribe((data: User[]) => {
        if (data && data.length) {
          this.usersList = data;
          const currentUser = data.find(item => item.username == this.username);
          if (currentUser) {
            this.userData = currentUser;
            userSubject.next(currentUser);
            userSubject.complete();
          }
        }
      });
    } else if (this.userData) {
      userSubject.next(this.userData);
      userSubject.complete();
    } else {
      this.logout();
    }

    return userSubject.asObservable() as Observable<User>;
  }

  get token() {
    return localStorage.getItem(TOKEN);
  }

  set token(token: string) {
    localStorage.setItem(TOKEN, token);
  }

  get user() {
    return this.userData;
  }

  get users() {
    return this.usersList;
  }

  get username() {
    return localStorage.getItem(USERNAME);
  }

  set username(username: string) {
    localStorage.setItem(USERNAME, username);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getUsers(id: string = '') {
    return this.http.get(this.apiUrl + 'api/v1/users/' + id);
  }

}
