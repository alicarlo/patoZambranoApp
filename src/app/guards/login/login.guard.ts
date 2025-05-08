import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

	constructor(private _AuthService: AuthService, private _Router: Router) {}
  async canActivate() {
    const  flag = await this._AuthService.loggedInDataUser();
		if (!!flag) {
      const user = await this._AuthService.getDataUser();
      const route = user.role === 'admin' ? '/admin-page' : '/map';
      this._Router.navigate([route]);
      return false
    }
    return true;
  }
  
}