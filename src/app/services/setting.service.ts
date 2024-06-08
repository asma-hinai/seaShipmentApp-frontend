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
    .get(`${environment.baseURL}Users` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }


  addUser(params:any) {
    return this.http
      .post(`${environment.baseURL}Users` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  editUser(params:any , id:any) {
    return this.http
      .patch(`${environment.baseURL}Users/${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  deleteUser( id:any) {
    return this.http
      .delete(`${environment.baseURL}Users/${id}`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getRole(params:any){
    return this.http
    .get(`${environment.baseURL}Roles` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }
 



  addRole(params:any) {
    return this.http
      .post(`${environment.baseURL}Roles` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  editRole(params:any , id:any) {
    return this.http
      .patch(`${environment.baseURL}Roles/${id}` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  deleteRole(id:any) {
    return this.http
      .delete(`${environment.baseURL}Roles/${id}`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getPermissions(params:any) {
    return this.http
      .get(`${environment.baseURL}Roles/permissions` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  getRolesName() {
    return this.http
      .get(`${environment.baseURL}Roles/name`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  getIdentifiers() {
    return this.http
      .get(`${environment.baseURL}Identifiers`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  addIdentifiers(params:any) {
    return this.http
      .post(`${environment.baseURL}Identifiers` , params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  deleteIdentifiers(id:any) {
    return this.http
      .delete(`${environment.baseURL}Identifiers/${id}`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



}
