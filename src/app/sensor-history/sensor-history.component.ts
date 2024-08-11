import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';

export interface SensorHistoryResponse {
  status: string;
  data: {
    temperatura: { max: number; min: number };
    presion: { max: number; min: number };
    altitud: { max: number; min: number };
    humedad: { max: number; min: number };
    hscr_04: { max: number; min: number };
    mq2: { count: number };
    mq135: { count: number };
    fc28: { count: number };
  };
  message?: string;
}

interface UserWithHelmet {
  id: number;
  user_name: string;
  helmet: {
    helmet_serial_number: string;
  };
}

@Component({
  selector: 'app-sensor-history',
  templateUrl: './sensor-history.component.html',
  styleUrls: ['./sensor-history.component.css']
})
export class SensorHistoryComponent implements OnInit {

  usersWithHelmets: UserWithHelmet[] = [];
  selectedUserId: number | null = null;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  date: string = '';
  errorMessage: string = '';
  user: any;
  isUserMenuOpen = false;
  sensorData: SensorHistoryResponse | null = null;
  helmetId: string = '';

  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  constructor(
    private apiService: ApiserviceService,
    private authService: AuthserviceService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0];
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
    this.loadUsersWithHelmets();
  }

  loadUsersWithHelmets() {
    this.apiService.getAllUsersWithHelmets().subscribe(
      (users: UserWithHelmet[]) => {
        this.usersWithHelmets = users.filter(user => user.helmet && user.helmet.helmet_serial_number);
        console.log('Users with helmets:', this.usersWithHelmets);
      },
      error => {
        console.error('Error loading users with helmets:', error);
        this.errorMessage = 'Error al cargar la lista de usuarios con cascos.';
      }
    );
  }

  onUserSelect(event: any) {
    const selectedUser = this.usersWithHelmets.find(u => u.id === Number(event.target.value));
    if (selectedUser && selectedUser.helmet) {
      this.helmetId = selectedUser.helmet.helmet_serial_number;
      this.getSensorHistory();
    }
  }

  getSensorHistory() {
    if (!this.helmetId) {
      this.errorMessage = 'Por favor, seleccione un usuario con casco.';
      this.sensorData = null;
      return;
    }
  
    if (!this.date) {
      this.errorMessage = 'Por favor, seleccione una fecha.';
      this.sensorData = null;
      return;
    }
  
    const helmetData = {
      helmet_id: this.helmetId,
      date: this.date
    };
  
    this.apiService.gethistorialEmpleados(helmetData).subscribe(
      (response: SensorHistoryResponse) => {
        console.log('Respuesta completa:', response);
        if (response.status === 'success' && response.data) {
          this.sensorData = response;
          this.errorMessage = '';
          console.log('Datos del sensor:', this.sensorData);
        } else {
          this.errorMessage = response.message || 'No hay datos disponibles';
          this.sensorData = null;
        }
      },
      (error) => {
        console.error('Error al obtener el historial del sensor:', error);
        this.errorMessage = error.message;
        this.sensorData = null;
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

  onDateChange(event: any) {
    this.date = event.target.value;
    this.getSensorHistory();
  }

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
}