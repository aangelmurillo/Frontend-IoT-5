import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { ApiserviceService } from '../apiservice.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-ambiente',
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.css']
})
export class AmbienteComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  user: any;
  employeeName: string = '';
  helmetSerialNumber: string = '';
  user_employee: any;

  mq135Value: number = 0;
  mq2Value: number = 0;
  fc28Value: number = 0;
  humidity: number = 0;
  gasDetected: boolean = false;
  soilMoisture: boolean = false;
  humidityStatus: string = 'Normal';
  message: string = '';
  noDataMessage: string = '';
  name: string = '';
  helmet: string = '';

  private subscription?: Subscription;

  constructor(
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiserviceService,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.user = user;
        if (user) {
          this.employeeName = `${user.person.person_name} ${user.person.person_last_name}`;
          if (user.helmet) {
            this.helmetSerialNumber = user.helmet.helmet_serial_number;
          }
        }
      },
      error => {
        
      }
    );

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getUser(Number(id)).subscribe(
          data => {
            this.user_employee = data;
            this.name = `${this.user_employee.person.person_name} ${this.user_employee.person.person_last_name}`;
            this.helmet = this.user_employee.helmet.helmet_serial_number;

            if (this.user_employee && this.user_employee.helmet) {
              this.getSensorData();
              this.setupSocketSubscription();
            }
          },
          error => {
            this.message = "No se encontraron datos en el empleado";
            
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

  private getSensorData() {
    const helmetId = this.user_employee.helmet.helmet_serial_number;

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'mq135' }).subscribe(
      data => {
        this.mq135Value = data.latest_value || 0;
        this.updateGasStatus();
      },
      error => {
        this.message = "No se encontraron datos del sensor (mq135)";
        
      }
    );

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'mq2' }).subscribe(
      data => {
        this.mq2Value = data.latest_value || 0;
        this.updateGasStatus();
      },
      error => {
        
        this.message = "No se encontraron datos del sensor (mq2)";
      }
    );

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'fc28' }).subscribe(
      data => {
        this.fc28Value = data.latest_value || 0;
        this.updateSoilMoistureStatus();
      },
      error => {
        
        this.message = "No se encontraron datos del sensor (fc28)";
      }
    );

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'humedad' }).subscribe(
      data => {
        this.humidity = data.latest_value || 0;
        this.updateHumidityStatus();
      },
      error => {
        
        this.message = "No se encontraron datos del sensor (humedad)";
      }
    );
  }

  private setupSocketSubscription() {
    this.socket.emit('subscribe', this.user_employee.helmet.helmet_serial_number);
  
    this.socket.fromEvent('sensor:update').subscribe((data: any) => {
      if (!data.sensors || data.sensors.length === 0) {
        this.noDataMessage = 'No hay datos disponibles para este casco';
        return;
      }
  
      this.noDataMessage = '';
  
      const mq135Sensor = data.sensors.find((sensor: any) => sensor.tipo === 'mq135');
      const mq2Sensor = data.sensors.find((sensor: any) => sensor.tipo === 'mq2');
      const fc28Sensor = data.sensors.find((sensor: any) => sensor.tipo === 'fc28');
      const humiditySensor = data.sensors.find((sensor: any) => sensor.tipo === 'humedad');
  
      if (mq135Sensor) {
        this.mq135Value = mq135Sensor.info_sensor.valor || 0;
        this.updateGasStatus();
      }
  
      if (mq2Sensor) {
        this.mq2Value = mq2Sensor.info_sensor.valor || 0;
        this.updateGasStatus();
      }
  
      if (fc28Sensor) {
        this.fc28Value = fc28Sensor.info_sensor.valor || 0;
        this.updateSoilMoistureStatus();
      }
  
      if (humiditySensor) {
        this.humidity = humiditySensor.info_sensor.valor || 0;
        this.updateHumidityStatus();
      }
    });
  
    this.socket.fromEvent('no_data').subscribe((data: any) => {
      
      this.noDataMessage = 'No hay datos disponibles para este casco';
      this.getSensorData();
    });
  }
  

  private updateGasStatus() {
    this.gasDetected = this.mq135Value > 0 || this.mq2Value > 0;
    this.message = '';

    if (this.mq135Value > 0) {
      this.message = ' ¡Alerta! Se han detectado los siguientes gases: CO2, NH3, C6H6';
    }

    if (this.mq2Value > 0) {
      this.message = ' ¡Alerta! Se han detectado los siguientes gases: CH4, C3H8, C4H10, H2, CO, C2H50H, CO2, NOx';
    }

    if (this.mq135Value > 0 && this.mq2Value > 0) {
      this.message = ' ¡Alerta! Se han detectado los siguientes gases: CO2, NH3, C6H6, CH4, C3H8, C4H10, H2, CO, C2H50H, CO2, NOx';
    }
  }

  private updateSoilMoistureStatus() {
    this.soilMoisture = this.fc28Value == 0;
  }

  private updateHumidityStatus() {
    if (this.humidity > 70) {
      this.humidityStatus = 'Alta';
      this.message = ' La humedad es alta.';
    } else if (this.humidity < 30) {
      this.humidityStatus = 'Baja';
      this.message = ' La humedad es baja.';
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

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
}
