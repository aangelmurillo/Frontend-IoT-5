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

  expandedMenus: { [key: string]: boolean } = {
    inicio: false,
    empleados: false,
    otros: false
  };

  user: any;
  users: any[] = [];
  userGroups: any[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;

  constructor(
    private userService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
    private cookieService: CookieService
  ) {}

  toggleSubmenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  ngOnInit() {
    this.loadUsers();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        console.log("Datos del usuario ", data);
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updateUserGroups();
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  updateUserGroups() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.userGroups = this.groupUsers(this.users.slice(startIndex, endIndex), 4);
  }

  groupUsers(array: any[], groupSize: number) {
    let result = [];
    for (let i = 0; i < array.length; i += groupSize) {
      result.push(array.slice(i, i + groupSize));
    }
    return result;
  }

  getButtonColor(index: number): string {
    const colors = ['#85CAFF', '#40CFFF', '#2499C7', '#85CAFF'];
    return colors[index % colors.length];
  }

  onUserSelect(userId: number) {
    if (this.user.id === userId) {
      alert('No puedes eliminar tu propio usuario.');
      return;
    }

    const confirmed = window.confirm('¿Estás seguro que deseas eliminar este usuario?');
    if (confirmed) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          alert('Usuario eliminado');
          this.loadUsers();
          this.router.navigate(['/delete-employee']);
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

  changePage(page: number) {
    this.currentPage = page;
    this.updateUserGroups();
  }
}
