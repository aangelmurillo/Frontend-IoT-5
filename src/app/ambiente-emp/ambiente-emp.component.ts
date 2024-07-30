import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

interface SensorInfo {
  valor: number;
  unidad: string;
}

interface Sensor {
  nombre: string;
  tipo: string;
  info_sensor: SensorInfo;
}

interface SensorData {
  helmet_id: string;
  sensors: Sensor[];
  timestamp: string;
}

@Component({
  selector: 'app-ambiente-emp',
  templateUrl: './ambiente-emp.component.html',
  styleUrls: ['./ambiente-emp.component.css']
})
export class AmbienteEmpComponent {

  temperature: number = 0;
  temperatureF: number = 0;
  temperatureK: number = 0;
  status: string = 'Normal';
  message: string = '';
  mq135Value: number = 0;
  mq2Value: number = 0;
  fc28Value: number = 0;
  gasDetected: boolean = false;
  soilMoisture: boolean = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  private subscription?: Subscription;
  user: any;

  employeeName: string = '';
  helmetSerialNumber: string = '';

  constructor(
    private socketService: SocketService,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.socketService.connect();
    
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.employeeName = `${user.person.person_name} ${user.person.person_last_name}`;
        if (user.helmet) {
          this.helmetSerialNumber = user.helmet.helmet_serial_number;
          this.socketService.subscribe(this.helmetSerialNumber);
        }
      }
    });

    this.subscription = this.socketService.onSensorUpdate().subscribe(
      (data: SensorData) => {
        if (data.helmet_id === this.helmetSerialNumber) {
          this.updateSensorValues(data.sensors);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  private updateSensorValues(sensors: Sensor[]) {
    sensors.forEach(sensor => {
      switch (sensor.tipo) {
        case 'temperatura':
          this.temperature = sensor.info_sensor.valor;
          this.temperatureF = (this.temperature * 9/5) + 32;
          this.temperatureK = this.temperature + 273.15;
          this.updateTemperatureStatus();
          break;
        case 'mq135':
          this.mq135Value = sensor.info_sensor.valor;
          this.updateGasStatus();
          break;
        case 'mq2':
          this.mq2Value = sensor.info_sensor.valor;
          this.updateGasStatus();
          break;
        case 'fc28':
          this.fc28Value = sensor.info_sensor.valor;
          this.updateSoilMoistureStatus();
          break;
      }
    });
  }

  private updateTemperatureStatus() {
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

  private updateGasStatus() {
    this.gasDetected = this.mq135Value === 1 || this.mq2Value === 1;
    if (this.gasDetected) {
      this.message += ' ¡Alerta! Se ha detectado gas.';
    }
  }

  private updateSoilMoistureStatus() {
    this.soilMoisture = this.fc28Value > 0;
    if (this.soilMoisture) {
      this.message += ' Se ha detectado humedad en el suelo.';
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
