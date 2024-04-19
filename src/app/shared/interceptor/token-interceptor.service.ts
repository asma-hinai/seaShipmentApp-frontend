import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor, 
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { switchMap ,filter, take, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private tokenAttached: boolean = false;


  constructor(public authService: AuthService ,  private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.authService.getToken();
    

    if (jwtToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      });
    }

    return next.handle(request).pipe(catchError((error: any): Observable<never> => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.router.navigate(['/']);
        return throwError(() => new Error('An error occurred'));
      } else {
        return throwError(() => error);
      }
    }))
  
    
    
    ;


    
  }



}
