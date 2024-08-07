import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-psd',
  templateUrl: './dialog-psd.component.html',
  styleUrls: ['./dialog-psd.component.css']
})
export class DialogPsdComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPsdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private router: Router
  ) {}

  goToHome() {
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
}