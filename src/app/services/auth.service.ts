import { Injectable , Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private jwtTokenName = 'token';
  private _httpClient: HttpClient | null = null;

  constructor(private http: HttpClient , private injector: Injector) {}


  private get httpClient(): HttpClient {
    if (!this._httpClient) {
      this._httpClient = this.injector.get(HttpClient);
    }
    return this._httpClient;
  }

  loginUser(credentials: { email: string; password: string }) {
    return this.httpClient.post('/api/login', credentials);
  }





  login(params:any) {
    return this.http
      .post(`${environment.baseURL}auth/login`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  register(params:any) {
    return this.http
      .post(`${environment.baseURL}auth/register`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenName);
  }

  forgetPassword(params:any) {
    return this.http
      .post(`${environment.baseURL}Auth/password/forget`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }
  
  setPassword(params:any) {
    return this.http
      .post(`${environment.baseURL}Auth/password/reset`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  logout() {
    return this.http
      .post(`${environment.baseURL}Auth/logout`, null)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

}
