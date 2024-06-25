import { Injectable , Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})

export class OrdersService {
  

  constructor(public http: HttpClient) { }


getOrders(params:any){
    return this.http
    .get(`${environment.baseURL}Orders` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }


  getOrderswithPagination(params:any){
    return this.http
    .get(`${environment.baseURL}Orders/withPagination` , {params:params})
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }


  getOrderstatus(){
    return this.http
    .get(`${environment.baseURL}Orders/orderStatus`)
    .pipe(
      map((data) => data),
      catchError((error) => {
        throw error;
      })
    );
  }

  addOrders(params:any) {
    return this.http
      .post(`${environment.baseURL}Orders`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  deleterders(id:any) {
    return this.http
      .delete(`${environment.baseURL}Orders/${id}`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  AcceptOrders(id:any , params:any) {
    return this.http
      .patch(`${environment.baseURL}Orders/rejectAccept/${id}?type=${params.type}`, params)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  rejectOrders(id:any) {
    return this.http
      .patch(`${environment.baseURL}Orders/reject/${id}?type=${id}`, null)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


}
