import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-adverd',
  templateUrl: './dialog-adverd.component.html',
  styleUrls: ['./dialog-adverd.component.css']
})
export class DialogAdverdComponent {
  constructor(public dialogRef: MatDialogRef<DialogAdverdComponent>) {}

  cancelar() {
    this.dialogRef.close(false);
  }

  aceptar() {
    this.dialogRef.close(true);
  }
}
