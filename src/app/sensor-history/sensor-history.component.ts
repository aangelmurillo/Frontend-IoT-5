import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';

export interface SensorHistoryResponse {
  user_id: number;
  helmet_id: string;
  sensor_history: {
    temperature: any[];
    pressure: any[];
    altitude: any[];
    humidity: any[];
    hscr_04: any[];
    mq2: any[];
    mq135: any[];
    fc28: any[];
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



  constructor(private apiService: ApiserviceService,
    private authService: AuthserviceService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0]; // Set current date by default
    this.getSensorHistory();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
    
  }

  getSensorHistory() {
    this.apiService.getSensorHistory(this.date).subscribe(
      (response: SensorHistoryResponse) => {
        console.log('Respuesta completa:', response);
        if (response && response.helmet_id) {
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

  getMaxValue(data: any[]): number {
    return Math.max(...data.map(item => item.value));
  }
  
  getMinValue(data: any[]): number {
    return Math.min(...data.map(item => item.value));
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
