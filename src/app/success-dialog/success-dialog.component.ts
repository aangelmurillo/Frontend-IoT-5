import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  template: `
    <h2 mat-dialog-title>Éxito</h2>
    <mat-dialog-content>
      <p>{{data.message}}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="goToHome()">Aceptar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { 
      color: #4caf50; 
      font-size: 20px;
    }
    mat-dialog-content p {
      font-size: 18px;
    }
    button { 
      background-color: #2596BE; 
      color: white; 
      font-size: 18px;
      padding: 10px 20px;
      min-width: 120px;
    }
    button:hover {
      background-color: #1c7a9e;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private router: Router
  ) {} 

  goToHome() {
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
}