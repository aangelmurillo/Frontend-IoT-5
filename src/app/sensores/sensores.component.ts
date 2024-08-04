import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-sensores',
  templateUrl: './sensores.component.html',
  styleUrls: ['./sensores.component.css']
})
export class SensoresComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  userId!: number;
  personId!: number;
  user: any;
  availableHelmets: any[] = [];
  assignedHelmet: any = null;
  employeeName: string = '';
  helmetSerialNumber: any;

  constructor(private router: Router,
    private authService: AuthserviceService,
    private route: ActivatedRoute,
    private apiService: ApiserviceService) { }

  ngOnInit() {
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

    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.userId = +id;
      this.loadUserData();
    } else {
      console.error('User ID is not provided in the URL');
    }
  }
  ambiente() {
    this.router.navigate(['/sensores', this.userId, 'ambiente']);
  }
  estadisticas() {
    this.router.navigate(['/sensores', this.userId, 'temperatura']);
  }

  gps() {
    this.router.navigate(['/sensores', this.userId, 'gps']);
  }

  camara() {
    const enlaceDePrueba = 'https://ihelmet-octavio.loca.lt/';
    this.router.navigate(['/camara', encodeURIComponent(enlaceDePrueba)]);
  }

  async loadUserData() {
    try {
      const userData = await this.apiService.getUser(this.userId).toPromise();
      console.log('User Data:', userData);
      if (userData) {
        this.employeeName = `${userData.person.person_name} ${userData.person.person_last_name}`;
        if (userData.helmet) {
          this.helmetSerialNumber = userData.helmet.helmet_serial_number;
        }
      }
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }

  async loadAvailableHelmets() {
    try {
      this.availableHelmets = await this.apiService.casco().toPromise();
      // Filtrar el casco asignado de la lista de disponibles
      this.availableHelmets = this.availableHelmets.filter(helmet => helmet.id !== this.assignedHelmet?.id);
    } catch (error) {
      console.error('Error loading available helmets', error);
    }
  }

  toggleMenu() {
    this.sidenav.toggle();
  }
}
