import { Component } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  email: string = '';
  message: string = '';
  emailInvalid: boolean = false;
  isSuccess: boolean = false;
  errorMessages: string[] = [];

  constructor(
    private apiService: ApiserviceService,
    private router: Router
  ) {}

  sendVerificationCode() {
    this.errorMessages = []; // Limpiar errores previos
    // Validación general de formato de correo electrónico
    const generalEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    


    if (!generalEmailPattern.test(this.email)) {
      this.emailInvalid = true;
      this.message = 'Por favor, ingrese un correo electrónico válido.';
      this.isSuccess = false;
      return;
    }

    this.emailInvalid = false;

    this.apiService.sendEmailCode({email: this.email}).subscribe({
      next: (response: any) => {
        this.message = response;
        this.isSuccess = true;
        this.apiService.setEmail(this.email);
        this.router.navigate(['/verificacion']);
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
    }
    );
  }
}