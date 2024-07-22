import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthserviceService } from './authservice.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}
  
  canActivate(): boolean {
    const token = this.cookieService.get('auth_token')

    if (token) {
      //se corrigio la redireccion a home, antes estaba en /empleado
      this.router.navigate(['/home']) 
      return false;
    }

    return true;
  }
}