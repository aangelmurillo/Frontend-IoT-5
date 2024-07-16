import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}
  
  canActivate(): boolean {
    const token = this.cookieService.get('auth_token');

    if (token) {
      // Si hay un token, permite el acceso a la ruta
      return true;
    }

    // Si no hay token, redirige al usuario a la página de inicio de sesión
  this.router.navigate(['/']); // Asume que '/inicio' es tu ruta de login
    return false;
  }
}