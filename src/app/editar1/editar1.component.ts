import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-editar1',
  templateUrl: './editar1.component.html',
  styleUrls: ['./editar1.component.css']
})
export class Editar1Component implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  user: any;
  users: any[] = [];
  isUserMenuOpen = false;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 0;
  userGroups: any[] = [];
  idActual: any;

  constructor(
    private userService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.idActual = user.id;
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
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
    const selectedUser = this.users.find(user => user.id === userId);
    
    if (this.idActual != userId && selectedUser.rol.rol_name != "Employee") {
      alert('No puedes editar a otro administrador.');
      return;
    }
  
    this.router.navigate(['/edit-employee/edit/', userId]);
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
