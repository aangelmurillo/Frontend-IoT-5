import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-editar1',
  templateUrl: './editar1.component.html',
  styleUrls: ['./editar1.component.css']
})
export class Editar1Component implements OnInit {
  users: any[] = [];

  constructor(
    private userService: ApiserviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
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
    this.router.navigate(['/editar-empleado', userId]);
  }
}