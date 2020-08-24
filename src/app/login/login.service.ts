import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './../account/account.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) { }

  auth(params, cb: any = false) {
    return this.http.post(this.apiUrl + 'api-token-auth/', params).subscribe((data: any) => {
      if (data && data.token) {
        this.accountService.token = 'Token ' + data.token;
        this.accountService.username = params.username;
        if (!!cb) {
          cb();
        }
      }
    });
  }
}
