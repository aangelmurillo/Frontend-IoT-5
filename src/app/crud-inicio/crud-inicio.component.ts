import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-inicio',
  templateUrl: './crud-inicio.component.html',
  styleUrls: ['./crud-inicio.component.css']
})
export class CrudInicioComponent {

  constructor(private router: Router) { 
  }

  estadisticas() {
    this.router.navigate(['/registrar']);
  }

}
