import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService  } from '../apiservice.service'; // Asegúrate de importar el servicio correcto aquí

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent {

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrarseService: ApiserviceService  // Asegúrate de importar el servicio correcto aquí
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      birthday: ['', Validators.required],
      telefono: ['', Validators.required],
      nickname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }    

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Estado del formulario:', this.registerForm.status);
      console.log('Controles del formulario:', this.registerForm.controls);

      this.registrarseService.register(this.registerForm.value)
        .subscribe(response => {
          console.log('Usuario registrado', response);
          this.router.navigate(['/']);
        }, error => {
          console.error('Error al registrar usuario', error);
        });
    } else {
      console.error('Formulario inválido');
    }
  }
  
  onBackToHome() {
    this.router.navigate(['/']);
  }

}
