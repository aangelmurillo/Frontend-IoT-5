import { Component } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-password',
  templateUrl: './verification-password.component.html',
  styleUrls: ['./verification-password.component.css']
})
export class VerificationPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  verificationCode: string = '';
  message: string = '';

  constructor(private apiService: ApiserviceService, private router: Router) {}

  ngOnInit() {
    this.apiService.currentEmail.subscribe(email => this.email = email);
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.message = 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial';
      return;
    }

    const data = {
      email: this.email,
      'new-password': this.newPassword,
      'verification-code': this.verificationCode
    };

    console.log('Datos enviados:', data);

    this.apiService.updatePassword(data).subscribe(
      (response: any) => {
        this.message = response;
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
      },
      (error) => {
        console.error('Error detallado:', error);
        this.message = error.error || 'Error al actualizar la contraseña';
      }
    );
  }
}
