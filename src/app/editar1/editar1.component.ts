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

  constructor(
    private userService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,

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
        console.log("Datos del we ", data)
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
}