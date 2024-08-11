import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-errord',
  templateUrl: './dialog-errord.component.html',
  styleUrls: ['./dialog-errord.component.css']
})
export class DialogErrordComponent {
  constructor(public dialogRef: MatDialogRef<DialogErrordComponent>) {}

  aceptar() {
    this.dialogRef.close();
  }
}
