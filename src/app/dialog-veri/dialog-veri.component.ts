import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-veri',
  templateUrl: './dialog-veri.component.html',
  styleUrls: ['./dialog-veri.component.css']
})
export class DialogVeriComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogVeriComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private router: Router
  ) {}

  aceptar() {
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
}