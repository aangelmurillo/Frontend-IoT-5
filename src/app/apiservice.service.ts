import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { SensorHistoryResponse } from './sensor-history/sensor-history.component';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  private apiUrl = 'http://3.138.244.45'; 

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getHeaders(needsAuth: boolean = false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    if (needsAuth) {
      const token = this.cookieService.get('auth_token');
      console.log('Token in headers:', token);
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.error('No token found in cookie');
      }
    }
  
    return headers;
  }

  // Registro
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/people`, userData); 
  }

  register_address(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addresses`, userData);
  }

  register_user(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  // Update
  update(userData: any, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/people/${userId}`, userData, { headers: this.getHeaders(true) }); 
  }

  update_address(userData: any, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/addresses/${userId}`, userData, { headers: this.getHeaders(true) }); 
  }

  update_user(userData: any, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData, { headers: this.getHeaders(true) }); 
  }

  delete_user(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers: this.getHeaders(true) });
  }

  casco(): Observable<any> {
    return this.http.get(`${this.apiUrl}/helmets`, { headers: this.getHeaders(true) });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { headers: this.getHeaders(true) });
  }

  getUserName(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData, { headers: this.getHeaders() }); 
  }

  getPerson(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/people/${id}`, { headers: this.getHeaders(true) });
  }

  getAddress(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/addresses/${id}`, { headers: this.getHeaders(true) });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders(true) });
  }

  userinfo(): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}/users/info`, { headers }).pipe(
      tap(),
      catchError(error => {
        console.error('Error en userinfo:', error);
        return throwError(error);
      })
    );
  }

  helmets(helmetData: any): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.apiUrl}/helmets`, helmetData, { headers }); 
  }


  sendEmailCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-code`, { email }, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
  
  updatePassword(data: { email: string, 'new-password': string, 'verification-code': string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-update`, data, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
  

private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();

  setEmail(email: string) {
    this.emailSource.next(email);
  }

  getSensorHistory(date: string): Observable<SensorHistoryResponse> {
    const token = this.cookieService.get('auth_token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('date', date);
  
    return this.http.get<SensorHistoryResponse>(
      `${this.apiUrl}/users/sensorHistory`, 
      { 
        headers: headers,
        params: params
      }
    ).pipe(
      tap(response => console.log('Respuesta de la API:', response)),
      catchError(this.handleError)    );
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  verifyUser(verificationData: { email: string, code: string }) {
    return this.http.post(`${this.apiUrl}/verificate-account`, verificationData);
  }

  deleteUser(userId: number) {
    const token = this.cookieService.get('auth_token');  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/users/${userId}`,{headers},);
  }
}
