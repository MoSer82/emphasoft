import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from './account/account.service';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private accountService: AccountService,
        private snackBar: MatSnackBar
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        if (this.accountService.token != null) {
            authReq = req.clone({ headers: req.headers.set('Authorization', this.accountService.token)});
        }

        return next.handle(authReq).pipe(catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    this.accountService.logout();
                } else {
                    let msg = err.message;
                    if (err.error.non_field_errors && err.error.non_field_errors.length) {
                        msg = '';
                        err.error.non_field_errors.forEach(item => {
                            msg += item + ', ';
                        });
                    }
                    console.log(msg);
                    this.snackBar.open(msg, 'x', {
                        duration: 3500
                    });
                }
                return throwError(err);
            }
        }));
    }
}