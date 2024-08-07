import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-casco',
  templateUrl: './casco.component.html',
  styleUrls: ['./casco.component.css']
})
export class CascoComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  registerForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private apiService: ApiserviceService,
    private authService: AuthserviceService,
    private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      helmet_serial_number: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{3}$')]]
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const helmetData = {
        helmet_serial_number: this.registerForm.get('helmet_serial_number')?.value,
      };
  
      this.apiService.helmets(helmetData).subscribe(
        response => {
          console.log('Casco registrado exitosamente', response);
          this.openSuccessDialog('Registro de Helmet exitoso');
        },
        error => {
          console.error('Error registrando el casco', error);
          // You might want to show an error dialog here
        }
      );
    } else {
      console.error('Formulario inválido');
    }
  }

  openSuccessDialog(message: string) {
    this.dialog.open(SuccessDialogComponent, {
      data: { message: message },
      width: '300px'
    });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isUserMenuOpen = false;
  }

  onBackToHome() {
    this.router.navigate(['/home']);
  }
}