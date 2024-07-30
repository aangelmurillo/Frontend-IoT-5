import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
@Component({
  selector: 'app-camara-emp',
  templateUrl: './camara-emp.component.html',
  styleUrls: ['./camara-emp.component.css']
})
export class CamaraEmpComponent {
  cameraLink: string | null = null;
  timestamp: number = 0;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isUserMenuOpen = false; 
  user: any;



  constructor(private route: ActivatedRoute,private authService: AuthserviceService, private router: Router,) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const encodedLink = params.get('cameraLink');
      console.log('Encoded Camera Link:', encodedLink);
      if (encodedLink) {
        this.cameraLink = decodeURIComponent(encodedLink);
        this.timestamp = Date.now();
        console.log('Decoded Camera Link:', this.cameraLink);
      }
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }
  
  getImageUrl(): string {
    return this.cameraLink ? `${this.cameraLink}&t=${this.timestamp}` : '';
  }

  toggleMenu() {
    this.sidenav.toggle();
  } 

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isUserMenuOpen = false;
  }

  onBackToHome() {
    this.router.navigate(['/empleados']);
  }

}
