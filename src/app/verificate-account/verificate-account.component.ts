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
  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
  
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
        console.log('Respuesta recibida:', response);
        this.message = response.message;
        if (response && response.id) {
          console.log('ID recibido:', response.id);
          this.router.navigate(['/verificate-account-code', response.id, this.email]);
        } else {
          console.error('Estructura de respuesta inválida:', response);
          this.errorMessages.push('Error al procesar la solicitud. Estructura de respuesta inválida.');
        }
      },
      error: (error: any) => {
        console.error('Error detallado:', error);
        if (error.error && error.error.message) {
          this.errorMessages.push(error.error.message);
        } else if (error.message) {
          this.errorMessages.push(error.message);
        } else {
          this.errorMessages.push('Ocurrió un error desconocido');
        }
      }
    });
  }

  

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isUserMenuOpen = false;
  }
}