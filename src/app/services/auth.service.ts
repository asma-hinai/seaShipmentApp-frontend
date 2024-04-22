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




  loginTest() {
    let params =  {"Email":"merchant@thawani.om","Password":"Th@w@ni:2021"}
    return this.http
      .post(`https://uatmerchant.thawani.om/api/auth/login`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  login(params:any) {
    return this.http
      .post(`${environment.baseURL}AccessManagement/login`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  register(params:any) {
    return this.http
      .post(`${environment.baseURL}AccessManagement/register`, params)
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
      .post(`${environment.baseURL}AccessManagement/forget-password`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }
  
  setPassword(params:any) {
    return this.http
      .post(`${environment.baseURL}AccessManagement/set-password`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

}
