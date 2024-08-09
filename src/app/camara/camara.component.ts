import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css']
})
export class CamaraComponent implements OnInit {
  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  cameraLink: string | null = null;
  timestamp: number = 0;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false; 
  user: any;
  user_employee: any;
  helmet: any;
  name: string = '';

  constructor(private route: ActivatedRoute,private authService: AuthserviceService, private router: Router, private apiService: ApiserviceService) {}
  
  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getUser(Number(id)).subscribe(
          (data: any) => {
            this.user_employee = data;
            this.name = `${this.user_employee.person.person_name} ${this.user_employee.person.person_last_name}`;
            this.helmet = this.user_employee.helmet.helmet_serial_number;
          },
          error => {
            console.error('Error obteniendo datos del usuario:', error);
          }
        );
      }
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
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

  onBackToHome() {
    this.router.navigate(['/empleados']);
  }
  

}