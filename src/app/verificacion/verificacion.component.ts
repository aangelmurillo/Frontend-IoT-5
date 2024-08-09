import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild('codeInput2') codeInput2!: ElementRef;
  @ViewChild('codeInput3') codeInput3!: ElementRef;
  @ViewChild('codeInput4') codeInput4!: ElementRef;
  @ViewChild('codeInput5') codeInput5!: ElementRef;
  @ViewChild('codeInput6') codeInput6!: ElementRef;

  verificationForm: FormGroup;
  email: string | null = null;
  userId: number | null = null;
  isUserMenuOpen = false;
  user: any;
  codeError: string | null = null;
  verificationCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiserviceService,
    private authService: AuthserviceService,
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.email = params.get('email');
      const id = params.get('id');
      this.userId = id ? +id : null;
  
      if (!this.email || !this.userId) {
        console.error('Parámetros de ruta incompletos');
        this.router.navigate(['/verificate-account']);
      }
    });
  
    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
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

  validateCode(code: string): boolean {
    const regex = /^[A-Z]{3}\d{3}$/;
    return regex.test(code);
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

  verifyCode() {
    this.verificationCode = Array.from(document.querySelectorAll('.code-input'))
      .map((input: any) => input.value)
      .join('');

    this.validateVerificationCode();
    if (this.codeError) {
      return;
    }

    if (this.verificationCode.length === 6 && this.email) {
      const verificationData = {
        email: this.email,
        code: this.verificationCode
      };

      this.apiService.verifyUser(verificationData).subscribe(
        response => {
          console.log('User verified successfully', response);
          alert('Verificación exitosa');
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Error verifying user', error);
          this.codeError = 'Código de verificación incorrecto';
        }
      );
    } else {
      this.codeError = 'Por favor, ingrese un código válido de 6 dígitos';
    }
  }

  onSubmit() {
    this.verifyCode();
  }

  onCancel() {
    if (confirm('¿Estás seguro de que deseas cancelar? Se eliminará tu registro.')) {
      if (this.userId) {
        this.apiService.deleteUser(this.userId).subscribe(
          response => {
            console.log('User deleted successfully', response);
            alert('Tu registro ha sido eliminado.');
            this.router.navigate(['/']);
          },
          error => {
            console.error('Error deleting user', error);
            alert('Hubo un error al eliminar tu registro. Por favor, contacta al soporte.');
            this.router.navigate(['/']);
          }
        );
      } else {
        console.error('User ID is null');
        alert('No se pudo identificar tu registro. Por favor, contacta al soporte.');
        this.router.navigate(['/']);
      }
    }
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
}