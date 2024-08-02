import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-eliminar-empleado',
  templateUrl: './eliminar-empleado.component.html',
  styleUrls: ['./eliminar-empleado.component.css']
})
export class EliminarEmpleadoComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false;

  user: any;
  users: any[] = [];

  constructor(
    private userService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log("Datos del usuario ", data)
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  getButtonColor(index: number): string {
    const colors = ['#85CAFF', '#40CFFF', '#2499C7', '#85CAFF'];
    return colors[index % colors.length];
  }

  onUserSelect(userId: number) {
    const confirmed = window.confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (confirmed) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          alert('Usuario eliminado');          
          this.loadUsers();
          this.router.navigate(['/empleados']);
        },
        (error) => {
          console.error('Error al eliminar usuario', error);
        }
      );
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
