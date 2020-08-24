import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private snackBar: MatSnackBar,
    private service: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
  }

  login() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.service.auth(this.form.value, () => {
        this.router.navigate(['/account']);
      });
    }
  }

}
