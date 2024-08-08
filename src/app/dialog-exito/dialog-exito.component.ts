import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-exito',
  templateUrl: './dialog-exito.component.html',
  styleUrls: ['./dialog-exito.component.css']
})
export class DialogExitoComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogExitoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, id: string, email: string },
    private router: Router
  ) {}

  aceptar() {
    this.dialogRef.close();
    this.router.navigate(['/verificacion', this.data.id, this.data.email]);
  }
}