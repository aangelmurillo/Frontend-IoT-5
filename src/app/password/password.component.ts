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

  constructor(private apiService: ApiserviceService,
    private router: Router

  ) {}

  sendVerificationCode() {
    this.apiService.sendEmailCode(this.email).subscribe(
      (response: any) => {
        // Aquí puedes procesar la respuesta de texto directamente
        this.message = response;
        this.apiService.setEmail(this.email);
        this.router.navigate(['/verificacion']);
      },
      (error) => {
        console.error('Error detallado:', error);
        this.message = `Error al enviar el código de verificación: ${error.message || error}`;
      }
    );
  }
  
}
