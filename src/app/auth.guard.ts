import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}
  
  canActivate() :boolean {
    const token = this.cookieService.get('auth_token');

    if (token) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;

  }
}
