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
      helmet_id: ['', Validators.required],
    });
  }

  onSubmit() {
    try {
      if (this.registerForm.valid) {
        const addressData = {
          address_street: this.registerForm.get('address_street')?.value,
          address_exterior_number: this.registerForm.get('address_exterior_number')?.value,
          address_interior_number: this.registerForm.get('address_interior_number')?.value,
          address_neighborhood: this.registerForm.get('address_neighborhood')?.value,
          address_zip_code: this.registerForm.get('address_zip_code')?.value,
          address_city: this.registerForm.get('address_city')?.value,
          address_state: this.registerForm.get('address_state')?.value,
          address_country: this.registerForm.get('address_country')?.value,
          person_id: this.registerForm.get('helmet_id')?.value, 
        };

        this.apiService.register_address(addressData).subscribe(
          addressResponse => {
            console.log('Address registered successfully', addressResponse);
            this.router.navigate(['/empleados']);
          },
          error => {
            console.error('Error registering address', error);
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
    this.apiService.getUsers().subscribe(
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
}
