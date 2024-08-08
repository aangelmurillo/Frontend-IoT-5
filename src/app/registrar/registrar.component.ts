import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogExitoComponent } from '../dialog-exito/dialog-exito.component'

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
  errorMessages: string [] = [];

  ngOnInit() {
    this.loadAvailableHelmets();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });

    this.registerForm.get('rol_id')?.valueChanges.subscribe(value => {
      if (value === '1') {
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
    private dialog: MatDialog // Añade esta línea
  ) {
    this.registerForm = this.fb.group({
      person_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_last_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_second_last_name: ['', [Validators.pattern(/^[a-zA-Z\s]+$/)]],
      person_curp: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{18}$/)]],
      person_phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address_street: ['', Validators.required],
      address_exterior_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address_interior_number: ['', Validators.pattern(/^[a-zA-Z0-9]+$/)],
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
      helmet_id: [''],
    });
  }

  onSubmit() {
    this.errorMessages = [];
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
          this.registerAddress(personResponse.id);
        },
        error => {
          console.error('Error registering person', error);
          if (error.error && error.error.message) {
            this.errorMessages.push(error.error.message);
          }
        }
      );
    } else {
      this.errorMessages.push('Por favor, complete todos los campos requeridos correctamente.');
    }
  }

  registerAddress(personId: number) {
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
      person_id: personId,
    };

    this.apiService.register_address(addressData).subscribe(
      addressResponse => {
        console.log('Address registered successfully', addressResponse);
        this.registerUser(personId);
      },
      error => {
        console.error('Error registering address', error);
        this.apiService.deletePerson(personId).subscribe(
          () => console.log('Person eliminada '),
          error => console.error('Error al borrar persona', error)
        );
        if (error.error && error.error.message) {
          this.errorMessages.push(error.error.message);
        }
      }
    );
  }

  registerUser(personId: number) {
    const userData = {
      person_id: personId,
      user_name: this.registerForm.get('user_name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      rol_id: this.registerForm.get('rol_id')?.value,
      helmet_id: this.registerForm.get('rol_id')?.value === '1' ? null : this.registerForm.get('helmet_id')?.value,
    };

    this.apiService.register_user(userData).subscribe(
      userResponse => {
        console.log('User registered successfully', userResponse);
        this.openSuccessDialog(userResponse.id, userResponse.email);
      },
      error => {
        console.error('Error al registrar usario', error);
        this.apiService.deletePerson(personId).subscribe(
          () => console.log('Person eliminada por error en registro de usuario'),
          error => console.error('Error deleting person', error)
        );
        if (error.error && error.error.message) {
          this.errorMessages.push(error.error.message);
        }
      }
    );
  }

  openSuccessDialog(id: string, email: string) {
    const dialogRef = this.dialog.open(DialogExitoComponent, {
      data: {
        message: "Empleado registrado exitosamente",
        id: id,
        email: email
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/verificacion', id, email]);
    });
  }

  onBackToHome() {
    this.router.navigate(['/home']);
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