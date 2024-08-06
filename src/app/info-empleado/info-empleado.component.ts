import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-info-empleado',
  templateUrl: './info-empleado.component.html',
  styleUrls: ['./info-empleado.component.css']
})
export class InfoEmpleadoComponent implements OnInit {

  userId!: number;
  personId!: number;
  addressId!: number;
  editForm: FormGroup;
  availableHelmets: any[] = [];
  assignedHelmet: any = null;
  user: any;
  addresses: any[] = [];

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
  ) {
    this.editForm = this.fb.group({
      person_name: [''],
      person_last_name: [''],
      person_second_last_name: [''],
      user_name: [''],
      email: [''],
      address_id: [''],
      address_street: [''],
      address_exterior_number: [''],
      address_interior_number: [''],
      address_neighborhood: [''],
      address_zip_code: [''],
      address_city: [''],
      address_state: [''],
      address_country: [''],
      person_curp: [''],
      person_phone_number: [''],
      rol_id: [''],
      helmet_id: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.userId = +id;
      this.loadUserData();
      this.loadAvailableHelmets();
    } else {
      console.error('User ID is not provided in the URL');
    }

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
  }

  async loadUserData() {
    try {
      const userData = await this.apiService.getUser(this.userId).toPromise();
      console.log('User Data:', userData);
      const personData = await this.apiService.getPerson(userData.person_id).toPromise();
      console.log('Person Data:', userData.person.id);

      if (Array.isArray(personData) && personData.length > 0) {
        this.personId = personData[0].id;
      } else if (personData && personData.id) {
        this.personId = personData.id;
      } else {
        console.error('Unable to determine person ID from API response');
      }

      if (userData.helmet) {
        this.assignedHelmet = {
          id: userData.helmet.id,
          helmet_serial_number: userData.helmet.helmet_serial_number
        };
        this.editForm.patchValue({
          helmet_id: this.assignedHelmet.id
        });
      }

      const person = personData[0];
      this.addresses = person.addresses;

      this.editForm.patchValue({
        user_name: userData.user_name,
        email: userData.email,
        rol_id: userData.rol_id.toString(),
        person_name: person.person_name,
        person_last_name: person.person_last_name,
        person_second_last_name: person.person_second_last_name,
        person_curp: person.person_curp,
        person_phone_number: person.person_phone_number,
        address_id: this.addresses[0].id
      });
      this.onAddressChange(this.addresses[0].id);
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }

  onAddressChange(addressId: number) {
    const selectedAddress = this.addresses.find(addr => addr.id === addressId);
    if (selectedAddress) {
      this.editForm.patchValue({
        address_street: selectedAddress.address_street,
        address_exterior_number: selectedAddress.address_exterior_number,
        address_interior_number: selectedAddress.address_interior_number,
        address_neighborhood: selectedAddress.address_neighborhood,
        address_zip_code: selectedAddress.address_zip_code,
        address_city: selectedAddress.address_city,
        address_state: selectedAddress.address_state,
        address_country: selectedAddress.address_country,
      });
      this.addressId = addressId;
    }
  }

  onSubmit() {
    try {
      if (this.editForm.valid) {
        const personData = {
          person_name: this.editForm.get('person_name')?.value,
          person_last_name: this.editForm.get('person_last_name')?.value,
          person_second_last_name: this.editForm.get('person_second_last_name')?.value,
          person_curp: this.editForm.get('person_curp')?.value,
          person_phone_number: this.editForm.get('person_phone_number')?.value,
        };

        this.apiService.update(personData, this.personId).subscribe(
          personResponse => {
            console.log('Person updated successfully', personResponse);

            const addressData = {
              address_street: this.editForm.get('address_street')?.value,
              address_exterior_number: this.editForm.get('address_exterior_number')?.value,
              address_interior_number: this.editForm.get('address_interior_number')?.value,
              address_neighborhood: this.editForm.get('address_neighborhood')?.value,
              address_zip_code: this.editForm.get('address_zip_code')?.value,
              address_city: this.editForm.get('address_city')?.value,
              address_state: this.editForm.get('address_state')?.value,
              address_country: this.editForm.get('address_country')?.value,
              person_id: this.personId,
            };

            console.log('Address ID:', this.addressId);
            console.log('Address Data:', addressData);

            this.apiService.update_address(addressData, this.addressId).subscribe(
              addressResponse => {
                console.log('Address updated successfully', addressResponse);

                const userData = {
                  person_id: this.personId,
                  user_name: this.editForm.get('user_name')?.value,
                  email: this.editForm.get('email')?.value,
                  rol_id: this.editForm.get('rol_id')?.value,
                  helmet_id: this.editForm.get('helmet_id')?.value,
                };

                const userId = this.userId;

                this.apiService.update_user(userData, userId).subscribe(
                  userResponse => {
                    console.log('User updated successfully', userResponse);
                    this.router.navigate(['/empleados']);
                  },
                  error => {
                    console.error('Error updating user', error);
                  }
                );
              },
              error => {
                console.error('Error updating address', error);
                if (error.status === 404) {
                  alert('Dirección no encontrada');
                } else {
                  alert('Error al actualizar la dirección');
                }
              }
            );
          },
          error => {
            console.error('Error updating person', error);
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

  async loadAvailableHelmets() {
    try {
      this.availableHelmets = await this.apiService.casco().toPromise();
      // Filtrar el casco asignado de la lista de disponibles
      this.availableHelmets = this.availableHelmets.filter(helmet => helmet.id !== this.assignedHelmet?.id);
    } catch (error) {
      console.error('Error loading available helmets', error);
    }
  }

  hidePassword: boolean = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
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
