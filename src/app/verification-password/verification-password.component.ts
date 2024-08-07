import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-password',
  templateUrl: './verification-password.component.html',
  styleUrls: ['./verification-password.component.css']
})
export class VerificationPasswordComponent implements OnInit {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  verificationCode: string = '';
  message: string = '';
  isSuccess: boolean = false;
  codeError: string = ''; // Variable para el mensaje de error

  constructor(private apiService: ApiserviceService, private router: Router) {}

  ngOnInit() {
    this.apiService.currentEmail.subscribe(email => this.email = email);
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  }

  validateCode(code: string): boolean {
    const regex = /^[A-Z]{3}\d{3}$/;
    return regex.test(code);
  }

  onCodeInput(event: any, nextInput: any) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1) {
      input.value = value.toUpperCase();
      if (nextInput) {
        nextInput.focus();
      }
    } else if (value.length > 1) {
      input.value = value.charAt(0).toUpperCase();
    }

    // Actualizar el código de verificación
    this.verificationCode = Array.from(document.querySelectorAll('.code-input'))
      .map((input: any) => input.value)
      .join('');

    // Validar el código de verificación
    this.validateVerificationCode();
  }

  validateVerificationCode() {
    if (this.verificationCode.length === 6) {
      if (!this.validateCode(this.verificationCode)) {
        this.codeError = 'Formato inválido (ABC123)';
      } else {
        this.codeError = '';
      }
    } else {
      this.codeError = 'Añadir un código válido';
    }
  }

  updatePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden';
      this.isSuccess = false;
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.message = 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial';
      this.isSuccess = false;
      return;
    }

    if (this.codeError) {
      this.message = this.codeError;
      this.isSuccess = false;
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
        this.isSuccess = true;
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
      },
      (error) => {
        console.error('Error detallado:', error);
        this.message = error.error || 'Error al actualizar la contraseña';
        this.isSuccess = false;
      }
    );
  }

  verifyCode() {
    // Este método se llama cuando se envía el formulario
    this.verificationCode = Array.from(document.querySelectorAll('.code-input'))
      .map((input: any) => input.value)
      .join('');

    this.validateVerificationCode();
    if (this.codeError) {
      return;
    }

    this.updatePassword();
  }
}
