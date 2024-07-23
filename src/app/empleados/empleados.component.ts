import { Component, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  users: any[] = [];
  user: any;


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
    this.router.navigate(['/sensores', userId]);

  }

  toggleMenu() {
    this.sidenav.toggle();
  }

}
