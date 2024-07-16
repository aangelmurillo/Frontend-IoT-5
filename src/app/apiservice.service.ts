import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  private apiUrl = 'http://3.138.244.45'; 

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getHeaders(needsAuth: boolean=false): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  
    if (needsAuth) {
      const token = this.cookieService.get('auth_token');
      console.log('Token in headers:', token);
      if (token) {
        headers = headers.set('Authorization', 'Bearer ${token}');
      } else {
        console.error('No token found in cookie');
      }
    }
  
    return headers;
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/people`, userData); 
  }
  register_address(userData: any):Observable<any> {
    return this.http.post(`${this.apiUrl}/addresses`, userData);
  }

  register_user(userData: any):Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  casco():Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/helmets`, { headers});
  }

  address(addressData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adress`, addressData, { headers: this.getHeaders(true)});
  }

  getAddresses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/adresses`, {headers: this.getHeaders(true) });
  }

  getUsers(): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users`, { headers});
  }

  getUserName(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
  
  login(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userData, {headers: this.getHeaders()}); 
  }

  getPerson(id: number): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/people/${id}`,{headers});
  }

  getAddress(id: number): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/addresses/${id}`,{headers});
  }

  getUser(id: number): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/users/${id}`,{headers});
  }

}