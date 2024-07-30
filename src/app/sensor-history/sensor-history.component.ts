import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthserviceService } from '../authservice.service';
import { Router } from '@angular/router';

export interface SensorStats {
  max: number;
  min: number;
}

export interface SensorCount {
  count: number;
}

export interface HelmetStats {
  temperatura: SensorStats;
  presion: SensorStats;
  altitud: SensorStats;
  humedad: SensorStats;
  hscr_04: SensorStats;
  mq2: SensorCount;
  mq135: SensorCount;
  fc28: SensorCount;
}

export interface HelmetData {
  helmet_id: string;
  stats: HelmetStats;
}

export interface SensorHistoryResponse {
  status: string;
  data: HelmetData[];
}


@Component({
  selector: 'app-sensor-history',
  templateUrl: './sensor-history.component.html',
  styleUrls: ['./sensor-history.component.css']
})
export class SensorHistoryComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  date: string = '';
  sensorData: any = null;
  message: string = '';
  user: any;
  isUserMenuOpen = false;



  constructor(private apiService: ApiserviceService,
    private authService: AuthserviceService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.date = new Date().toISOString().split('T')[0]; // Set current date by default
    this.getSensorHistory();
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      console.log('User: ', user);
    });
    
  }

  getSensorHistory() {
    this.apiService.getSensorHistory(this.date).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.sensorData = response.data;
        } else {
          this.message = 'No data available';
        }
      },
      (error) => {
        console.error('Error fetching sensor history:', error);
        this.message = 'Error fetching sensor history';
      }
    );
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

}
