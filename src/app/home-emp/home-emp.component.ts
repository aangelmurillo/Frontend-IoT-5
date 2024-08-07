import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiserviceService } from '../apiservice.service';
@Component({
  selector: 'app-home-emp',
  templateUrl: './home-emp.component.html',
  styleUrls: ['./home-emp.component.css']
})
export class HomeEmpComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  userId!: number;
  personId!: number;
  user: any;
  availableHelmets: any[] = [];
  assignedHelmet: any = null;
  employeeName: string = '';
  helmetSerialNumber: any;
  isUserMenuOpen = false;


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
  }
ambiente()
{
  this.router.navigate(['/ambiente-emp']);
}
  estadisticas() {
    this.router.navigate(['/temperatura-emp']);
  }

  gps() {
    this.router.navigate(['/gps-emp', this.user.helmet.id]);
  }

  camara() {
    //const enlaceDePrueba = 'https://via.placeholder.com/640x480.png?text=Camera+Test';
    this.router.navigate(['/camara-emp', /*encodeURIComponent(enlaceDePrueba)*/]);  
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


  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
        this.router.navigate(['/']);
        this.isUserMenuOpen = false;
  }

}

