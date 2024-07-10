import { Component } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';

@Component({
  selector: 'app-editar1',
  templateUrl: './editar1.component.html',
  styleUrls: ['./editar1.component.css']
})
export class Editar1Component {

  users: any[] = [];

  constructor(private userService: ApiserviceService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
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

}
