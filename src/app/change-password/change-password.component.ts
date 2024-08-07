import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogPsdComponent } from '../dialog-psd/dialog-psd.component'; 

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordError: string = '';
  formError: string = '';

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) {}

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
    } else {
      // Aquí iría la lógica para cambiar la contraseña
      console.log('Contraseña cambiada exitosamente');
      
      // Mostrar el diálogo de éxito
      this.openSuccessDialog();
    }
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

