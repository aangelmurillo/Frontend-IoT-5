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
  temperature: number = 0;
  temperatureF: number = 0;
  temperatureK: number = 0;
  status: string = 'Normal';
  message: string = '';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  user_employee: any;

  private subscription?: Subscription;
  user: any;
  employeeName: string = '';
  helmetSerialNumber: any;
  isUserMenuOpen = false;

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
      (error) => {
        console.error('Error obteniendo datos del usuario:', error);
      }
    );

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('ID del usuario:', id);
        this.apiService.getUser(Number(id)).subscribe(
          (data: any) => {
            this.user_employee = data;
            console.log('Datos del usuario:', data);

            if (this.user_employee && this.user_employee.helmet) {
              // Suscribirse al ID del casco a través del WebSocket
              this.socket.emit('subscribe', this.user_employee.helmet.helmet_serial_number);

              // Escuchar las actualizaciones de sensores
              this.socket.fromEvent('sensor:update').subscribe((data: any) => {
                console.log('Actualización de sensor:', data);
                // Aquí puedes manejar los datos recibidos del sensor
                const temperatureSensor = data.sensors.find((sensor: any) => sensor.tipo === 'temperatura');
                if (temperatureSensor) {
                  this.temperature = temperatureSensor.info_sensor.valor;
                  this.temperatureF = (this.temperature * 9/5) + 32;
                  this.temperatureK = this.temperature + 273.15;
                  this.updateStatus();
                }
              });

              // Manejar el caso en que no hay datos para el casco
              this.socket.fromEvent('no_data').subscribe((data: any) => {
                console.log(data.message);
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
  }

  private updateStatus() {
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
