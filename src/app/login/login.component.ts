import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AccountService } from './../account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9\_\-]*')]),
    password: new FormControl('', Validators.required)
  });

  public disableBtn: boolean;

  constructor(
    private service: LoginService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.disableBtn = false;
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.disableBtn = true;
      this.service.auth(this.form.value).subscribe((data: any) => {
        if (data && data.token) {
          this.accountService.token = 'Token ' + data.token;
          this.accountService.username = this.form.get('username').value;
          this.router.navigate(['/account']);
        }
      }, (err) => {
        this.disableBtn = false;
      });
    }
  }

}
