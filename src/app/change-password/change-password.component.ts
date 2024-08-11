import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogPsdComponent } from '../dialog-psd/dialog-psd.component';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordError: string = '';
  formError: string = '';
  email: string = '';
  verificationCode: string = '';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private apiService: ApiserviceService
  ) {}

  ngOnInit() {
    this.apiService.currentEmail.subscribe(email => this.email = email);
    this.apiService.currentVerificationCode.subscribe(code => this.verificationCode = code);
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword() {
    this.formError = '';
    this.passwordError = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.formError = 'Llenar todos los campos';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    const updateData = {
      email: this.email,
      'new-password': this.newPassword,
      'verification-code': this.verificationCode
    };

    this.apiService.updatePassword(updateData).subscribe({
      next: (response) => {
        console.log('Contraseña cambiada exitosamente');
        this.openSuccessDialog();
      },
      error: (error) => {
        console.error('Error al cambiar la contraseña:', error);
        if (error.error && typeof error.error === 'string') {
          try {
            // AQUI SE PARSEA EL ERROR A JSON
            const errorObj = JSON.parse(error.error);
            if (errorObj.message) {
              this.formError = errorObj.message;
            } else {
              this.formError = error.error;
            }
          } catch {
            // Y SI NO SE PUEDE PARSEAR, SE MUESTRA EL ERROR COMO STRING
            this.formError = error.error;
          }
        } else if (error.error && error.error.message) {
          this.formError = error.error.message;
        } else if (error.message) {
          this.formError = error.message;
        } else {
          this.formError = 'Ocurrió un error al cambiar la contraseña.';
        }
      }
    });
  }

  openSuccessDialog() {
    const dialogRef = this.dialog.open(DialogPsdComponent, {
      data: { message: 'La contraseña se ha actualizado correctamente' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/home']);
    });
  }
}