import { Component, OnInit, ViewChild } from '@angular/core';
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

  verificationForm: FormGroup;
  email: string | null = null;
  userId: number | null = null;

  isUserMenuOpen = false;

  user: any;


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
    this.email = this.route.snapshot.paramMap.get('email');
    const id = this.route.snapshot.paramMap.get('id');
    this.userId = id ? +id : null;


    if (!this.email) {
      console.error('No email provided');
      this.router.navigate(['/empleados']);
    }

    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );
  }

  onSubmit() {
    if (this.verificationForm.valid && this.email) {
      const code = this.verificationForm.get('code')?.value;
      const verificationData = {
        email: this.email,
        code: code
      };

      this.apiService.verifyUser(verificationData).subscribe(
        response => {
          console.log('User verified successfully', response);
          alert('Verificación exitosa');
          this.router.navigate(['/empleados']);
        },
        error => {
          console.error('Error verifying user', error);
          alert('Código de verificación incorrecto');
        }
      );
    }
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