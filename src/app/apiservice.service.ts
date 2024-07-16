import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {

  private apiUrl = 'http://3.138.244.45/'; 

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/people`, userData); 
  }
  

  address(addressData: any): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/adress`, addressData, { headers });
  }

  getAddresses(): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/adresses`, { headers });
  }

  getUsers(): Observable<any> {
    const token = this.cookieService.get('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/users`, { headers });
  }

  getUserName(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
  
  login(userData: any) {
    return this.http.post(`${this.apiUrl}/login`, userData); 
  }

}