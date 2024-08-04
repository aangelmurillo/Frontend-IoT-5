import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { Socket } from 'ngx-socket-io';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.css']
})
export class AmbienteComponent implements OnInit, OnDestroy {
  message: string = '';
  mq135Value: number = 0;
  mq2Value: number = 0;
  fc28Value: number = 0;
  gasDetected: boolean = false;
  soilMoisture: boolean = false;
  humidity: number = 0;
  humidityStatus: string = 'Normal';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;
  private subscription?: Subscription;
  user: any;
  employeeName: string = '';
  helmetSerialNumber: string = '';
  user_employee: any;

  constructor(
    private socket: Socket,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiserviceService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
        if (user) {
          this.employeeName = `${user.person.person_name} ${user.person.person_last_name}`;
          if (user.helmet) {
            this.helmetSerialNumber = user.helmet.helmet_serial_number;
            this.socket.emit('subscribe', this.helmetSerialNumber);
          }
        }
      },
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );

    this.subscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('ID del usuario:', id);
        this.api.getUser(Number(id)).subscribe(
          (data: any) => {
            this.user_employee = data;
            console.log('Datos del usuario:', data);

            if (this.user_employee && this.user_employee.helmet) {
              // Suscribirse al ID del casco a través del WebSocket
              this.socket.emit('subscribe', this.user_employee.helmet.helmet_serial_number);

              // Escuchar las actualizaciones de sensores
              this.socket.fromEvent('sensor:update').subscribe((data: any) => {
                console.log('Actualización de sensor:', data);
                this.updateSensorValues(data.sensors);
              });

              // Manejar el caso en que no hay datos para el casco
              this.socket.fromEvent('no_data').subscribe((data: any) => {
                console.log('No hay datos:', data.message);
              });
            }
          },
          (error) => {
            console.error('Error obteniendo datos del usuario:', error);
          }
        );
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.socket.emit('unsubscribe', this.helmetSerialNumber);
  }

  private sensorHandlers: { [key: string]: (valor: number) => void } = {
    'mq135': (valor: number) => {
      this.mq135Value = valor;
      this.updateGasStatus();
    },
    'mq2': (valor: number) => {
      this.mq2Value = valor;
      this.updateGasStatus();
    },
    'fc28': (valor: number) => {
      this.fc28Value = valor;
      this.updateSoilMoistureStatus();
    },
    'humedad': (valor: number) => {
      this.humidity = valor;
      this.updateHumidityStatus();
    }
  };
  

  private updateSensorValues(sensors: any[]) {
    console.log('Datos de sensores recibidos:', sensors);
    sensors.forEach((sensor: any) => {
      const handler = this.sensorHandlers[sensor.tipo];
      if (handler) {
        handler(sensor.info_sensor.valor);
      } else {
        console.log(`No hay manejador para el tipo de sensor: ${sensor.tipo}`);
      }
    });
  }
  
  
  private updateGasStatus() {
    this.gasDetected = this.mq135Value > 0 || this.mq2Value > 0;
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
  
  private updateHumidityStatus() {
    if (this.humidity > 70) {
      this.humidityStatus = 'Alta';
      this.message += ' La humedad es alta.';
    } else if (this.humidity < 30) {
      this.humidityStatus = 'Baja';
      this.message += ' La humedad es baja.';
    } else {
      this.humidityStatus = 'Normal';
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
