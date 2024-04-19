import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {}


  GetMonitor() {
    return this.http
      .get(`${environment.statisticsURL}statistics/ag/monitor`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  getBusinessApp() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/businessApp`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  gebusinessMonitoringLimit() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/businessMonitoringLimit`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  


  getCache() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/cache`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }




  getemployerWalletApp() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/employerWalletApp`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }




  getmobileApp() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/mobileApp`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getmpcss() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/mpcss`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }



  getnotification() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/notification`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  getomranOffers() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/omranOffers`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  getSamaApp() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/samaApp`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  getSuperAdminApp() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/superAdminApp`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

  gettableau() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/tableau`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }


  getUtility() {
    return this.http
      .get(`${environment.statisticsURL}statistics/db/utility`)
      .pipe(
        map((data) => data),
        catchError((error) => {
          throw error;
        })
      );
  }

}
