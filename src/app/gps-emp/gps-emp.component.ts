import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SocketService } from '../socket.service';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-gps-emp',
  templateUrl: './gps-emp.component.html',
  styleUrls: ['./gps-emp.component.css']
})
export class GpsEmpComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('map') map!: GoogleMap;
  isUserMenuOpen = false;


  user: any;

  latitude: number | null = null;
  longitude: number | null = null;
  lastUpdated: Date | null = null;

  center: google.maps.LatLngLiteral = { lat: 25.54389, lng: -103.41898 };
  zoom = 15;
  markerPosition: google.maps.LatLngLiteral | null = null;
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  helmetSerialNumber: string | null = null;

  constructor(private socketService: SocketService, private route: ActivatedRoute,
    private authService: AuthserviceService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.socketService.connect();

    this.helmetSerialNumber = this.route.snapshot.paramMap.get('helmetSerialNumber');

    if (this.helmetSerialNumber) {
      this.socketService.subscribe(this.helmetSerialNumber);
    }

    this.socketService.onSensorUpdate().subscribe((data: any) => {
      if (data.nombre === 'gps') {
        if (data.tipo === 'gps-latitud') {
          this.latitude = data.info_sensor.valor;
        } else if (data.tipo === 'gps-longitud') {
          this.longitude = data.info_sensor.valor;
        }
        this.lastUpdated = new Date(data.info_sensor.fecha);

        if (this.latitude !== null && this.longitude !== null) {
          this.updateMapCenter(this.latitude, this.longitude);
        }
      }
    });
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
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
