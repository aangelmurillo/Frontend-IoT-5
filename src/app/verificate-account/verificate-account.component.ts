import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-verificate-account',
  templateUrl: './verificate-account.component.html',
  styleUrls: ['./verificate-account.component.css']
})
export class VerificateAccountComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;
  user: any;
  email: string = '';
  message: string = '';
  errorMessages: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private apiService: ApiserviceService
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  sendVerificationCode() {
    this.errorMessages = []; // Limpiar errores previos
    this.apiService.verifySendCode({email: this.email}).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.apiService.setEmail(this.email);
        this.router.navigate(['/verificacion']);
      },
      error: (error: any) => {
        console.error('Error detallado:', error);
        this.errorMessages.push(error.error.message);
      }
    });
  }

  

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isUserMenuOpen = false;
  }
}