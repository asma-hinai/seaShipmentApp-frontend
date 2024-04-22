import { Injectable , Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { HttpBackend , HttpClientModule , HTTP_INTERCEPTORS ,HttpClientXsrfModule} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class SettingService {

  constructor(public http: HttpClient) { }


  getUsers(params:any){
    return this.http
    .get(`${environment.baseURL}AccessManagement/user` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }


  addUser(params:any) {
    return this.http
      .post(`${environment.baseURL}AccessManagement/user` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  editUser(params:any , id:any) {
    return this.http
      .put(`${environment.baseURL}AccessManagement/user/id:${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  deleteUser(params:any , id:any) {
    return this.http
      .delete(`${environment.baseURL}AccessManagement/user/id:${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getRole(params:any){
    return this.http
    .get(`${environment.baseURL}AccessManagement/role` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }
 


  addRole(params:any){
    return this.http
    .get(`${environment.baseURL}AccessManagement/role` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }

  editRole(params:any , id:any) {
    return this.http
      .put(`${environment.baseURL}AccessManagement/role/id:${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  deleteRole(params:any , id:any) {
    return this.http
      .delete(`${environment.baseURL}AccessManagement/role/id:${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getPermissions(params:any) {
    return this.http
      .get(`${environment.baseURL}AccessManagement/permissions` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


}
