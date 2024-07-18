import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  private checkAuthStatus() {
    const token = this.cookieService.get('auth_token');
    if (token) {
      this.loadUserInfo();
    }
  }

  login(credentials: any): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.cookieService.set('auth_token', response.token);
          this.loadUserInfo();
        }
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

  loadUserInfo() {
    this.apiService.userinfo().subscribe(
      user => this.currentUserSubject.next(user),
      error => {
        console.error('Error loading user info', error);
        this.logout();
      }
    );
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }}
