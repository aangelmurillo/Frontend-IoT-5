import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { ApiserviceService } from '../apiservice.service';
import { Socket } from 'ngx-socket-io';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css']
})
export class GpsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('map') map!: GoogleMap;
  isUserMenuOpen = false;

  user: any;
  employeeName: string = '';
  helmetSerialNumber: any;
  user_employee: any;

  latitude: number | null = null;
  longitude: number | null = null;
  altitude: number | null = null;
  lastUpdated: Date | null = null;

  center: google.maps.LatLngLiteral = { lat: 25.54389, lng: -103.41898 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral | null = null;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

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
                const latitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'gps-latitud');
                const longitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'gps-longitud');
                const altitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'altitud');

                if (latitudeSensor && longitudeSensor) {
                  this.latitude = latitudeSensor.info_sensor.valor;
                  this.longitude = longitudeSensor.info_sensor.valor;
                  this.lastUpdated = new Date(data.timestamp);
                
                  this.latitude && this.longitude && this.updateMapCenter(this.latitude, this.longitude);
                }

                if (altitudeSensor) {
                  this.altitude = altitudeSensor.info_sensor.valor;
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
    this.socket.emit('unsubscribe', this.helmetSerialNumber);
  }

  private updateMapCenter(lat: number, lng: number) {
    this.center = { lat, lng };
    this.markerPosition = { lat, lng };
    this.map.panTo(this.center);
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
