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

  latitude: string | null = null;
  longitude: string | null = null;
  altitude: string | null = null;
  lastUpdated: Date | null = null;
  helmet: any;
  name: string = '';

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
          },
          error => {
            this.latitude = "No se encontraron datos en el empleado";
            this.altitude = "No se encontraron datos en el empleado";
            this.longitude = "No se encontraron datos en el empleado";
            this.lastUpdated = new Date();
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

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'gps-latitud' }).subscribe(
      (data: any) => {
        this.latitude = data.latest_value || "No se encontraron datos del sensor (latitud)";
        this.lastUpdated = data.timestamp;
        this.updateMapCenter();
      },
      (error) => {
        this.latitude = "No se encontraron datos del sensor (latitud)";
      }
    );

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'gps-longitud' }).subscribe(
      (data: any) => {
        this.longitude = data.latest_value || "No se encontraron datos del sensor (longitud)";
        this.updateMapCenter();
      },
      (error) => {
        this.longitude = "No se encontraron datos del sensor (longitud)";
      }
    );

    this.apiService.getSensorData({ helmet_id: helmetId, sensor_type: 'altitud' }).subscribe(
      (data: any) => {
        this.altitude = data.latest_value || "No se encontraron datos del sensor (altitud)";
      },
      (error) => {
        this.altitude = "No se encontraron datos del sensor (altitud)";
      }
    );
  }

  private setupSocketSubscription() {
    this.socket.emit('subscribe', this.user_employee.helmet.helmet_serial_number);

    this.socket.fromEvent('sensor:update').subscribe((data: any) => {
      const latitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'gps-latitud');
      const longitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'gps-longitud');
      const altitudeSensor = data.sensors.find((sensor: any) => sensor.tipo === 'altitud');

      if (latitudeSensor && longitudeSensor) {
        this.latitude = latitudeSensor.info_sensor.valor || "No se encontraron datos del sensor (latitud)";
        this.longitude = longitudeSensor.info_sensor.valor || "No se encontraron datos del sensor (longitud)";
        this.lastUpdated = new Date(data.timestamp);
        this.updateMapCenter();
      }

      if (altitudeSensor) {
        this.altitude = altitudeSensor.info_sensor.valor || "No se encontraron datos del sensor (altitud)";
      }
    });

    this.socket.fromEvent('no_data').subscribe((data: any) => {
      this.getSensorData();
    });
  }

  private updateMapCenter() {
    if (this.latitude !== null && this.longitude !== null && this.latitude !== "No se encontraron datos del sensor (latitud)" && this.longitude !== "No se encontraron datos del sensor (longitud)") {
      this.center = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
      this.markerPosition = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
      this.map.panTo(this.center);
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
