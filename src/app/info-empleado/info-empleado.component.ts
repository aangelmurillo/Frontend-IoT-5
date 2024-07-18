import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
@Component({
  selector: 'app-info-empleado',
  templateUrl: './info-empleado.component.html',
  styleUrls: ['./info-empleado.component.css']
})
export class InfoEmpleadoComponent implements OnInit {

  userId!: number;
  personId!: number; // Añade esta línea
  addressId!: number; // Añade esta línea
  editForm: FormGroup;
  availableHelmets: any[] = [];
  assignedHelmet: any = null;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiserviceService,
    private router: Router

  ) {
    this.editForm = this.fb.group({
      person_name: [''],
      person_last_name: [''],
      person_second_last_name: [''],
      user_name: [''],
      email: [''],
      address_street: [''],
      address_exterior_number: [''],
      address_interior_number: [''],
      address_neighborhood: [''],
      address_zip_code: [''],
      address_city: [''],
      address_state: [''],
      address_country: [''],
      person_date_of_birth: [''],
      person_curp: [''],
      person_phone_number: [''],
      person_emergency_phone_number: [''],
      person_gender: [''],
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
      }

  
      const person = personData[0];
      const address = person.addresses[0]; 

      this.addressId = address.id; // Asigna el addressId aquí

  
      this.editForm.patchValue({
        // User data
        user_name: userData.user_name,
        email: userData.email,
        rol_id: userData.rol_id.toString(),
        helmet_id: userData.helmet_id,
        // Person data
        person_name: person.person_name,
        person_last_name: person.person_last_name,
        person_second_last_name: person.person_second_last_name,
        person_date_of_birth: this.formatDate(person.person_date_of_birth),
        person_curp: person.person_curp,
        person_phone_number: person.person_phone_number,
        person_emergency_phone_number: person.person_emergency_phone_number,
        person_gender: person.person_gender,
      });
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }
  
  // Helper function to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    try {
      if (this.editForm.valid) {
        const personData = {
          person_name: this.editForm.get('person_name')?.value,
          person_last_name: this.editForm.get('person_last_name')?.value,
          person_second_last_name: this.editForm.get('person_second_last_name')?.value,
          person_curp: this.editForm.get('person_curp')?.value,
          person_date_of_birth: this.editForm.get('person_date_of_birth')?.value,
          person_phone_number: this.editForm.get('person_phone_number')?.value,
          person_emergency_phone_number: this.editForm.get('person_emergency_phone_number')?.value,
          person_gender: this.editForm.get('person_gender')?.value,
        };
        
  
        this.apiService.update(personData,this.personId).subscribe(
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
              person_id: personResponse.id,
            };
  
  
            this.apiService.update_address(addressData, this.addressId).subscribe(
              addressResponse => {
                console.log('Address updated successfully', addressResponse);
  
                const userData = {
                  person_id: personResponse.id,
                  user_name: this.editForm.get('user_name')?.value,
                  email: this.editForm.get('email')?.value,
                  rol_id: this.editForm.get('rol_id')?.value,
                  helmet_id: this.editForm.get('helmet_id')?.value,
                };
  
                const userId = this.userId; 
  
                this.apiService.update_user(userData, userId).subscribe(
                  userResponse => {
                    console.log('User updated successfully', userResponse);
                    this.router.navigate(['/crud']);
                  },
                  error => {
                    console.error('Error updating user', error);
                  }
                );
              },
              error => {
                console.error('Error updating address', error);
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
    this.router.navigate(['/crud']);
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
}