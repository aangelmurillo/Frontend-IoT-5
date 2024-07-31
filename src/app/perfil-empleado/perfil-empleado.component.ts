import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-perfil-empleado',
  templateUrl: './perfil-empleado.component.html',
  styleUrls: ['./perfil-empleado.component.css']
})
export class PerfilEmpleadoComponent implements OnInit {
  user: any;
  addresses: any[] = [];
  selectedAddress: any;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  constructor(
    private apiService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
      if (this.user && this.user.person && this.user.person.addresses) {
        this.addresses = this.user.person.addresses;
        if (this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0];
        }
      }
    });
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
}