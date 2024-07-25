import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, catchError } from 'rxjs/operators';
import { AuthserviceService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthProtectedGuard implements CanActivate {

  constructor(
    private cookieService: CookieService,
    private authService: AuthserviceService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const token = this.cookieService.get('auth_token');
    if (!token) {
      this.router.navigate(['/']);
      return of(false);
    }

    return this.authService.isAuthenticated() ? 
      this.authService.getCurrentUser().pipe(
        take(1),
        switchMap(user => {
          if (!user) {
            return this.authService.loadUserInfo().pipe(
              map(() => true),
              catchError(() => {
                this.router.navigate(['/']);
                return of(false);
              })
            );
          }
          return of(true);
        }),
        switchMap(() => {
          const requiredRoles = route.data['roles'] as string[];
          return this.authService.hasRole(requiredRoles).pipe(
            map(hasRole => {
              if (!hasRole) {
                this.router.navigate(['/unauthorized']);
                return false;
              }
              return true;
            }),
            catchError(() => {
              this.router.navigate(['/']);
              return of(false);
            })
          );
        })
      ) : of(false);
  }
}
