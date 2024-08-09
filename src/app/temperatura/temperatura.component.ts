import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { ApiserviceService } from '../apiservice.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.component.html',
  styleUrls: ['./temperatura.component.css']
})
export class TemperaturaComponent implements OnInit, OnDestroy {
  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  
  temperature: number | null = 0;
  temperatureF: number | null = 0;
  temperatureK: number | null = 0;
  status: string = 'Normal';
  message: string = '';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  user_employee: any;
  name: string = '';
  helmet: any;

  private subscription?: Subscription;
  user: any;
  employeeName: string = '';
  helmetSerialNumber: string = '';
  isUserMenuOpen = false;

  constructor(
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiserviceService,
    private socket: Socket
  ) { }

  ngOnInit() {
    // Obtener información del usuario actual
    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
        if (user) {
          this.employeeName = `${user.person.person_name} ${user.person.person_last_name}`;
          if (user.helmet) {
            this.helmetSerialNumber = user.helmet.helmet_serial_number;
          }
        }
      }
    );

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getUser(Number(id)).subscribe(
          (data: any) => {
            this.user_employee = data;
            this.name = `${this.user_employee.person.person_name} ${this.user_employee.person.person_last_name}`;
            this.helmet = this.user_employee.helmet.helmet_serial_number;

            if (this.user_employee && this.user_employee.helmet) {
              this.getSensorData(); // Llamada inicial para obtener datos del sensor
              this.setupSocketSubscription(); // Configura la suscripción al WebSocket
            }
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getSensorData() {
    this.apiService.getSensorData({ helmet_id: this.user_employee.helmet.helmet_serial_number, sensor_type: 'temperatura' }).subscribe(
      (data: any) => {
        this.updateTemperature(data.latest_value !== undefined ? data.latest_value : null);
      },
      error => {
        this.updateTemperature(null);
      }
    );
  }

  private setupSocketSubscription() {
    this.socket.emit('subscribe', this.user_employee.helmet.helmet_serial_number);

    // Escuchar actualizaciones de temperatura
    this.subscription = this.socket.fromEvent('sensor:update').subscribe((data: any) => {
      const temperatureSensor = data.sensors.find((sensor: any) => sensor.tipo === 'temperatura');
      if (temperatureSensor) {
        this.updateTemperature(temperatureSensor.info_sensor.valor !== undefined ? temperatureSensor.info_sensor.valor : null);
      }
    });

    // Manejo de la falta de datos
    this.socket.fromEvent('no_data').subscribe((data: any) => {
      if (data.message === 'No se encontraron datos para el casco ' + this.user_employee.helmet.helmet_serial_number) {
        this.getSensorData(); // Reintentar obtener datos del sensor
      }
    });
  }

  private updateTemperature(value: number | null) {
    if (value !== null) {
      this.temperature = value;
      this.temperatureF = (this.temperature * 9 / 5) + 32;
      this.temperatureK = this.temperature + 273.15;
    } else {
      this.temperature = null;
      this.temperatureF = null;
      this.temperatureK = null;
    }
    this.updateStatus(); // Actualiza el estado en función de la nueva temperatura
  }

  private updateStatus() {
    if (this.temperature !== null) {
      if (this.temperature > 35) {
        this.status = 'Peligro';
        this.message = 'La Temperatura ha superado el límite seguro';
      } else if (this.temperature > 27) {
        this.status = 'Advertencia';
        this.message = 'La Temperatura está cerca del límite seguro';
      } else {
        this.status = 'Normal';
        this.message = 'La Temperatura está dentro del rango normal';
      }
    } else {
      this.status = 'Desconocido';
      this.message = 'No se encontraron datos del sensor';
    }
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
