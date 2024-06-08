import { Injectable } from '@angular/core';
import { AES } from 'crypto-ts';

import { environment } from 'src/environments/environment';
import { PermissionsList } from '../../../app/shared/interfaces/permission.config';
import { HttpClient, HttpClientModule , HTTP_INTERCEPTORS ,HttpClientXsrfModule} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import Utf8 from 'crypto-js/enc-utf8';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(public http: HttpClient) {

  }

  async encryptData(message:any) {
    let ecrypted = await AES.encrypt(message, environment.key);
    return ecrypted;
  }

  async decryptData(message:any) {
    let bytes = await AES.decrypt(message.toString(), environment.key);
    return bytes.toString(Utf8);
  }

  async checkPermission(code:any) {

    let permissionString = await this.decryptData(localStorage.getItem('permission'));
    let permission = JSON.parse(permissionString);
    var result = permission.filter((x:any) => x == code);
    
    if (result.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

 




  async getActivePermissionRoute() {
    if (await this.checkPermission(PermissionsList.Business_view)) {
      return 'dashboard'
    }
    else {
      return null;
    }
  }



}
