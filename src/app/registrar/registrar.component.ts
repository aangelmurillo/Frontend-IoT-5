import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  registerForm: FormGroup;
  availableHelmets: any[] = [];
  user: any;
  isUserMenuOpen = false;

  ngOnInit() {
    this.loadAvailableHelmets();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });

    this.registerForm.get('rol_id')?.valueChanges.subscribe(value => {
      if (value === '1') { // Assuming '1' is for Administrador
        this.registerForm.get('helmet_id')?.disable();
      } else {
        this.registerForm.get('helmet_id')?.enable();
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiserviceService,
    private authService: AuthserviceService,
  ) {
    this.registerForm = this.fb.group({
      person_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_second_last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_curp: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{18}$/)]],
      person_phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address_street: ['', Validators.required],
      address_exterior_number: ['', Validators.required],
      address_interior_number: [''],
      address_neighborhood: ['', Validators.required],
      address_zip_code: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      address_city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      address_state: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      address_country: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      address_references: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      user_name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rol_id: ['', Validators.required],
      helmet_id: ['', Validators.required],
    });
  }

  onSubmit() {
    try {
      if (this.registerForm.valid) {
        const personData = {
          person_name: this.registerForm.get('person_name')?.value,
          person_last_name: this.registerForm.get('person_last_name')?.value,
          person_second_last_name: this.registerForm.get('person_second_last_name')?.value,
          person_curp: this.registerForm.get('person_curp')?.value,
          person_phone_number: this.registerForm.get('person_phone_number')?.value,
        };
  
        this.apiService.register(personData).subscribe(
          personResponse => {
            console.log('Person registered successfully', personResponse);
            alert('Registro de persona exitosa');

            const addressData = {
              address_references: this.registerForm.get('address_references')?.value,
              address_street: this.registerForm.get('address_street')?.value,
              address_exterior_number: this.registerForm.get('address_exterior_number')?.value,
              address_interior_number: this.registerForm.get('address_interior_number')?.value,
              address_neighborhood: this.registerForm.get('address_neighborhood')?.value,
              address_zip_code: this.registerForm.get('address_zip_code')?.value,
              address_city: this.registerForm.get('address_city')?.value,
              address_state: this.registerForm.get('address_state')?.value,
              address_country: this.registerForm.get('address_country')?.value,
              person_id: personResponse.id,
            };
  
            this.apiService.register_address(addressData).subscribe(
              addressResponse => {
                console.log('Address registered successfully', addressResponse);
                alert('Registro de direccion exitoso');

                const userData = {
                  person_id: personResponse.id,
                  user_name: this.registerForm.get('user_name')?.value,
                  email: this.registerForm.get('email')?.value,
                  password: this.registerForm.get('password')?.value,
                  rol_id: this.registerForm.get('rol_id')?.value,
                  helmet_id: this.registerForm.get('helmet_id')?.value,
                };
  
                this.apiService.register_user(userData).subscribe(
                  userResponse => {
                    console.log('User registered successfully', userResponse);
                    alert('Registro de usuario. Por favor, verifica tu cuenta.');
                  this.router.navigate(['/verificacion', userResponse.id, userResponse.email]);
                  },
                  error => {
                    console.error('Error registering user', error);
                  }
                );
              },
              error => {
                console.error('Error registering address', error);
              }
            );
          },
          error => {
            console.error('Error registering person', error);
          }
        );
      } else {
        console.error('Form is invalid');
      }
    } catch (error) {
      console.error('An unexpected error occurred', error);
    }
  }
  

  onBackToHome() {
    this.router.navigate(['/empleados']);
  }

  loadAvailableHelmets() {
    this.apiService.casco().subscribe(
      (helmets) => {
        this.availableHelmets = helmets;
      },
      (error) => {
        console.error('Error al cargar los cascos', error);
      }
    );
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
