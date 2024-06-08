import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/app/services/app/permission.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(public permissionService: PermissionService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const permission = next.data.permission;
    if (permission === 1111) {
      return true
    } else {
      return this.checkAcess(permission);
    }
  }

  async checkAcess(permissionCode:any) {
    let permission: boolean;
    let resetPasword;
    resetPasword = localStorage.getItem('reset')
    permission = await this.permissionService.checkPermission(permissionCode);
    if (resetPasword === '1') {
      this.router.navigate(["auth/reset-password"]);
      return false;
    } else {
      if (permission) {
        return permission;
      } else {
        return this.router.navigate(["auth/permissions"]);
      }
    }
  }


}
