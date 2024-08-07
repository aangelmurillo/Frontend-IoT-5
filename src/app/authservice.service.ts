import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ApiserviceService } from './apiservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiserviceService,
    private cookieService: CookieService
  ) {
    this.checkAuthStatus();
  }

  public checkAuthStatus(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = this.cookieService.get('auth_token');
      if (token) {
        this.loadUserInfo().subscribe(
          user => {
  
            resolve();
          },
          error => {
  
            reject(error);
          }
        );
      } else {
        resolve();
      }
    });
  }

  login(credentials: any): Observable<any> {
    return this.apiService.login(credentials).pipe(
      switchMap(response => {
        if (response && response.token) {

          this.cookieService.set('auth_token', response.token.token, { expires: 1, path: '/' });
          return this.loadUserInfo();
        }
        return throwError('No se recibió token');
      })
    );
  }

  logout() {
    this.cookieService.delete('auth_token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('auth_token');
  }

  loadUserInfo(): Observable<any> {
    return this.apiService.userinfo().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        this.logout();
        return throwError(error);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }

  getUserRole(): Observable<string | null> {
    return this.currentUser$.pipe(
      map(user => {
        const rolSlug = user?.rol?.rol_slug;
        return rolSlug ?? null;
      })
    );
  }

  hasRole(roles: string[]): Observable<boolean> {
    return this.getUserRole().pipe(
      map(userRole => userRole !== null && roles.includes(userRole))
    );
  }
}
