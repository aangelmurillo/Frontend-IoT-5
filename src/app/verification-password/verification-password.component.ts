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
  verificationCode: string = '';
  codeError: string = '';

  constructor(private apiService: ApiserviceService, private router: Router) {}

  ngOnInit() {
    this.apiService.currentEmail.subscribe(email => this.email = email);
  }

  onCodeInput(event: any, nextInput: any) {
    if (event.target.value.length === event.target.maxLength) {
      if (nextInput) {
        nextInput.focus();
      }
    }
    this.updateVerificationCode();
  }

  updateVerificationCode() {
    const inputs = Array.from(document.querySelectorAll('.code-input')) as HTMLInputElement[];
    this.verificationCode = inputs
      .map(input => input.value.toUpperCase())
      .join('');
    console.log('Código actualizado:', this.verificationCode); // Para debugging
  }

  verifyCode() {
    this.codeError = '';
    if (this.verificationCode.length !== 6) {
      this.codeError = 'Por favor, ingrese el código completo de 6 caracteres.';
      return;
    }
  
    console.log('Enviando verificación:', { email: this.email, code: this.verificationCode });
  
    this.apiService.verifyPasswordCode({ email: this.email, verification_code: this.verificationCode }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);
        
        this.apiService.setVerificationCode(this.verificationCode);
        this.router.navigate(['/changepwd']);
      },
      error: (error: any) => {
        console.error('Error completo:', error);
        if (error.error && typeof error.error === 'string') {
          this.codeError = error.error;
        } else if (error.error && error.error.message) {
          this.codeError = error.error.message;
        } else if (error.message) {
          this.codeError = error.message;
        } else {
          this.codeError = 'Ocurrió un error al verificar el código.';
        }
      }
    });
  }
}