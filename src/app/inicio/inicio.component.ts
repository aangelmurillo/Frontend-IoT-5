import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  panelForm: FormGroup;  // Renombrado a 'panelForm'
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private loginService: ApiserviceService, 
    private cookieService: CookieService
  ) { 
    this.panelForm = this.formBuilder.group({
      user: ['', [Validators.required]],  // Agregados validadores
      password: ['', Validators.required]
    });
  }

  registrarse() {
    this.router.navigate(['/registrarse']);
  }

  onSubmit() {
    if (this.panelForm.valid) {
      const formData = this.panelForm.value;

      this.loginService.login(formData).subscribe(
        (response: any) => {
          console.log('Usuario logueado', response);
          if (response.token) {
            this.cookieService.set('auth_token', response.token.token, {expires: 1, path: '/'});
            console.log('Token guardado en cookie');
            this.router.navigate(['/editar']);
          }
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

  postLogin() {
    if (this.panelForm.valid) {
      this.loginService.login(this.panelForm.value).subscribe(
        (response: any) => {
          if (response && response.token) {
            this.cookieService.set('token', response.token, { path: '/' });
            console.log('Token guardado:', this.cookieService.get('token'));
            this.router.navigate(['/home']);
          } else {
            console.error('No se recibió un token válido');
            this.errorMessage = 'Error al iniciar sesión. Token inválido.';
          }
        },
        error => {
          console.error('Error de login:', error);
          this.errorMessage = error.error.message || 'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
        }
      );
    }
  }

}
