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

  constructor(
    private apiService: ApiserviceService,
    private router: Router
  ) {}

  sendVerificationCode() {
    // Validación general de formato de correo electrónico
    const generalEmailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    


    if (!generalEmailPattern.test(this.email)) {
      this.emailInvalid = true;
      this.message = 'Por favor, ingrese un correo electrónico válido.';
      this.isSuccess = false;
      return;
    }

    this.emailInvalid = false;

    this.apiService.sendEmailCode(this.email).subscribe(
      (response: any) => {
        this.message = response;
        this.isSuccess = true;
        this.apiService.setEmail(this.email);
        this.router.navigate(['/verificacion']);
      },
      (error) => {
        console.error('Error detallado:', error);
        this.message = `Error al enviar el código de verificación: ${error.message || error}`;
        this.isSuccess = false;
      }
    );
  }
}