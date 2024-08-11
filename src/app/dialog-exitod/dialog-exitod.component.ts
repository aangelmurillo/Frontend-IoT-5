import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-exitod',
  templateUrl: './dialog-exitod.component.html',
  styleUrls: ['./dialog-exitod.component.css']
})
export class DialogExitodComponent {
  constructor(public dialogRef: MatDialogRef<DialogExitodComponent>) {}

  aceptar() {
    this.dialogRef.close();
  }
}