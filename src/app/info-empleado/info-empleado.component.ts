import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
@Component({
  selector: 'app-info-empleado',
  templateUrl: './info-empleado.component.html',
  styleUrls: ['./info-empleado.component.css']
})
export class InfoEmpleadoComponent implements OnInit {

  userId!: number;
  editForm: FormGroup;
  availableHelmets: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiserviceService
  ) {
    this.editForm = this.fb.group({
      person_name: [''],
      person_last_name: [''],
      person_second_last_name: [''],
      user_name: [''],
      email: [''],
      password: [''],
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
    } else {
      console.error('User ID is not provided in the URL');
    }
  }

  async loadUserData() {
    try {
      const userData = await this.apiService.getUser(this.userId).toPromise();
      console.log('User Data:', userData); // Depuración: Verificar la estructura de los datos del usuario
      const personData = await this.apiService.getPerson(userData.person_id).toPromise();
      console.log('Person Data:', personData); // Depuración: Verificar la estructura de los datos de la persona
      this.editForm.patchValue({
        ...userData,
        ...personData,
      });
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }

  onSubmit() {
    // Implement update logic here
  }

  onBackToHome() {
    // Implement navigation back to home
  }
}
