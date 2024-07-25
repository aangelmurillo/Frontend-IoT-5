import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  panelForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthserviceService
  ) {
    this.panelForm = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.checkAuthStatus().then(() => {
      this.redirectBasedOnRole();
    }).catch(error => {
      console.error('Error al verificar el estado de autenticación:', error);
    });
  }

  registrarse() {
    this.router.navigate(['/registrarse']);
  }

  onSubmit() {
    if (this.panelForm.valid) {
      const formData = this.panelForm.value;

      this.authService.login(formData).subscribe(
        (user) => {
          console.log('Usuario logueado y información cargada:', user);
          this.redirectBasedOnRole();
        },
        error => {
          console.error('Error al loguear usuario', error);
          this.errorMessage = 'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
        }
      );
    } else {
      console.error('Formulario inválido');
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  private redirectBasedOnRole() {
    this.authService.getUserRole().subscribe(
      role => {
        console.log('Rol recibido:', role);
        if (role === 'admin') {
          this.router.navigate(['/empleados']);
        } else if (role === 'emplo') {
          this.router.navigate(['/inicio']);
        } else {
          console.error('Rol de usuario desconocido:', role);
          this.errorMessage = 'Error al determinar el rol del usuario.';
        }
      },
      error => {
        console.error('Error al obtener el rol del usuario', error);
        this.errorMessage = 'Error al determinar el rol del usuario.';
      }
    );
  }
}
