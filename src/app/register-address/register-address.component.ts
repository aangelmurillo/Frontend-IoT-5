import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-register-address',
  templateUrl: './register-address.component.html',
  styleUrls: ['./register-address.component.css']
})
export class RegisterAddressComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  registerForm: FormGroup;
  availableHelmets: any[] = [];
  user: any;
  isUserMenuOpen = false;
  errorMessage: string = '';

  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  ngOnInit() {
    this.loadAvailableHelmets();

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
      console.log();
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiserviceService,
    private authService: AuthserviceService,
  ) {
    this.registerForm = this.fb.group({
      address_street: ['', Validators.required],
      address_exterior_number: ['', Validators.required],
      address_interior_number: [''],
      address_neighborhood: ['', Validators.required],
      address_zip_code: ['', Validators.required],
      address_city: ['', Validators.required],
      address_state: ['', Validators.required],
      address_country: ['', Validators.required],
      person_id: ['', Validators.required],  // Cambiado de helmet_id a person_id
      referencia: ['', Validators.required]
    });
  }
  
  onSubmit() {
    this.errorMessage = '';
    try {
      if (this.registerForm.valid) {
        const addressData = {
          address_street: this.registerForm.get('address_street')?.value,
          address_references: this.registerForm.get('referencia')?.value,
          address_exterior_number: this.registerForm.get('address_exterior_number')?.value,
          address_interior_number: this.registerForm.get('address_interior_number')?.value,
          address_neighborhood: this.registerForm.get('address_neighborhood')?.value,
          address_zip_code: this.registerForm.get('address_zip_code')?.value,
          address_city: this.registerForm.get('address_city')?.value,
          address_state: this.registerForm.get('address_state')?.value,
          address_country: this.registerForm.get('address_country')?.value,
          person_id: this.registerForm.get('person_id')?.value,  // Asignar el person_id
        };
  
        this.apiService.register_address(addressData).subscribe(
          addressResponse => {
            console.log('Address registered successfully', addressResponse);
            this.router.navigate(['/home']);
          },
          error => {
            console.log(addressData);
            console.error('Error registering address', error);
            this.errorMessage = 'Hubo un problema al registrar la dirección';
          }
        );
      } else {
        this.errorMessage = 'Por favor, completa todos los campos requeridos';
      }
    } catch (error) {
      console.error('Error en onSubmit', error);
      this.errorMessage = 'Ocurrió un error inesperado';
    }
  }
  

  onBackToHome() {
    this.router.navigate(['/home']);
  }

  loadAvailableHelmets() {
    this.apiService.getAllUsers().subscribe(
      (helmets) => {
        this.availableHelmets = helmets;
        console.log('user:' ,helmets)
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
