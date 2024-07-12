import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';


@Component({
  selector: 'app-sensores',
  templateUrl: './sensores.component.html',
  styleUrls: ['./sensores.component.css']
})
export class SensoresComponent {
  constructor(private router: Router) { 
  }

  estadisticas() {
    this.router.navigate(['/temperatura']);
  }
}
