import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute
import { AuthserviceService } from '../authservice.service';

interface SensorInfo {
  valor: number;
  unidad: string;
  fecha: string;
}

interface Sensor {
  nombre: string;
  tipo: string;
  info_sensor: SensorInfo;
}

interface SensorData {
  id: string;
  helmet_id: number;
  sensors: Sensor[];
}

@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.component.html',
  styleUrls: ['./temperatura.component.css']
})
export class TemperaturaComponent implements OnInit, OnDestroy {
  temperature: number = 0;
  temperatureF: number = 0;
  temperatureK: number = 0;
  status: string = 'Normal';
  message: string = '';
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private subscription?: Subscription;
  user: any;

  employeeName: string = '';
  helmetSerialNumber: any;

  isUserMenuOpen = false;


  constructor(private socketService: SocketService,
              private authService: AuthserviceService,
              private route: ActivatedRoute,
              private router: Router,
            ) {} // Inyectar ActivatedRoute

  ngOnInit() {
    this.socketService.connect();
    this.socketService.subscribe('1'); // Assuming helmet_id is '1'

    this.subscription = this.socketService.onSensorUpdate().subscribe(
      (data: SensorData) => {
        const temperatureSensor = data.sensors.find(sensor => sensor.tipo === "temperatura");
        if (temperatureSensor) {
          this.temperature = temperatureSensor.info_sensor.valor;
          this.temperatureF = (this.temperature * 9/5) + 32;
          this.temperatureK = this.temperature + 273.15;
          
          this.updateStatus();
        }
      }
    );

    // Obtener datos del empleado desde el servicio de autenticación
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
      if (user) {
        this.employeeName = `${user.person.person_name} ${user.person.person_last_name}`;
        if (user.helmet) {
          this.helmetSerialNumber = user.helmet.helmet_serial_number;
        }
      }
    });

    // Opción para obtener datos desde la URL si es necesario
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Lógica para cargar datos del usuario basado en el ID si es necesario
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  private updateStatus() {
    if (this.temperature > 38) {
      this.status = 'Peligro';
      this.message = 'La Temperatura ha superado el límite seguro';
    } else if (this.temperature > 37) {
      this.status = 'Advertencia';
      this.message = 'La Temperatura está cerca del límite seguro';
    } else {
      this.status = 'Normal';
      this.message = '';
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
