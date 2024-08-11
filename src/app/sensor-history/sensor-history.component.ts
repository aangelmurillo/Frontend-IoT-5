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
}

@Component({
  selector: 'app-sensor-history',
  templateUrl: './sensor-history.component.html',
  styleUrls: ['./sensor-history.component.css']
})
export class SensorHistoryComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  date: string = '';
  message: string = '';
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
  }

  getSensorHistory() {
    if (!this.helmetId) {
      this.message = 'Por favor, ingrese un ID de casco válido';
      return;
    }

    const helmetData = {
      helmet_id: this.helmetId,
      date: this.date
    };

    this.apiService.gethistorialEmpleados(helmetData).subscribe(
      (response: SensorHistoryResponse) => {
        console.log('Respuesta completa:', response);
        if (response && response.status === 'success') {
          this.sensorData = response;
          console.log('Datos del sensor:', this.sensorData);
        } else {
          this.message = 'No hay datos disponibles';
          console.log('No se encontraron datos');
        }
      },
      (error) => {
        console.error('Error al obtener el historial del sensor:', error);
        this.message = `Error al obtener el historial del sensor: ${error.message}`;
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

  onHelmetIdChange(event: any) {
    this.helmetId = event.target.value;
  }

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  getTemperatureMax(): number {
    return this.sensorData ? this.sensorData.data.temperatura.max : 0;
  }

  getTemperatureMin(): number {
    return this.sensorData ? this.sensorData.data.temperatura.min : 0;
  }

  getPressureMax(): number {
    return this.sensorData ? this.sensorData.data.presion.max : 0;
  }

  getPressureMin(): number {
    return this.sensorData ? this.sensorData.data.presion.min : 0;
  }

  getAltitudeMax(): number {
    return this.sensorData ? this.sensorData.data.altitud.max : 0;
  }

  getAltitudeMin(): number {
    return this.sensorData ? this.sensorData.data.altitud.min : 0;
  }

  getHumidityMax(): number {
    return this.sensorData ? this.sensorData.data.humedad.max : 0;
  }

  getHumidityMin(): number {
    return this.sensorData ? this.sensorData.data.humedad.min : 0;
  }

  getHscr04Max(): number {
    return this.sensorData ? this.sensorData.data.hscr_04.max : 0;
  }

  getHscr04Min(): number {
    return this.sensorData ? this.sensorData.data.hscr_04.min : 0;
  }

  getMq2Count(): number {
    return this.sensorData ? this.sensorData.data.mq2.count : 0;
  }

  getMq135Count(): number {
    return this.sensorData ? this.sensorData.data.mq135.count : 0;
  }

  getFc28Count(): number {
    return this.sensorData ? this.sensorData.data.fc28.count : 0;
  }
}
