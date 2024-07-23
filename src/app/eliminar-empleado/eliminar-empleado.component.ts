import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-empleado',
  templateUrl: './eliminar-empleado.component.html',
  styleUrls: ['./eliminar-empleado.component.css']
})
export class EliminarEmpleadoComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  user: any;
  users: any[] = [];

  constructor(
    private userService: ApiserviceService,
    private router: Router,
    private authService: AuthserviceService,
    private dialog: MatDialog
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
onUserSelect(userId: number){

}
  /*onUserSelect(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: '¿Estás seguro que deseas eliminar este usuario?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }*/

  deleteUser(userId: number) {
    this.userService.delete_user(userId).subscribe(
      () => {
        console.log('Usuario eliminado con éxito');
        this.loadUsers(); // Reload the user list
      },
      (error) => {
        console.error('Error al eliminar usuario', error);
      }
    );
  }

  toggleMenu() {
    this.sidenav.toggle();
  }
}