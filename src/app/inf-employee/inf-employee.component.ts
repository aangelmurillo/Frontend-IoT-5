import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { AuthserviceService } from '../authservice.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-inf-employee',
  templateUrl: './inf-employee.component.html',
  styleUrls: ['./inf-employee.component.css']
})
export class InfEmployeeComponent implements OnInit {
  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };
  user: any;
  empleado: any[] = [];
  selectedEmployee: any;
  selectedAddress: any;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  constructor(
    private apiService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
  ) {}

  ngOnInit() {
    this.apiService.getUsers().subscribe(empleados => {
      this.empleado = empleados;
      console.log('Empleados: ', empleados);
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
      if (this.user && this.user.person && this.user.person.addresses) {
        this.selectedAddress = this.user.person.addresses.length > 0 ? this.user.person.addresses[0] : null;
      }
    });
  }

  onEmployeeChange(employee: any) {
    this.selectedEmployee = employee;
    this.selectedAddress = employee.person.addresses.length > 0 ? employee.person.addresses[0] : null;
  }

  onAddressChange(address: any) {
    this.selectedAddress = address;
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
