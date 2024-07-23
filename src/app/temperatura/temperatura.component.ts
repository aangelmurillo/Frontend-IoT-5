import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service';
import { Subscription } from 'rxjs';

interface SensorInfo {
  valor: number;
  unidad: string;
  fecha: string;
}

interface Sensor {
  nombre: string;
  tipo: string;
  info_sensor: SensorInfo;
}

interface SensorData {
  id: string;
  helmet_id: number;
  sensors: Sensor[];
}

@Component({
  selector: 'app-temperatura',
  templateUrl: './temperatura.component.html',
  styleUrls: ['./temperatura.component.css']
})
export class TemperaturaComponent implements OnInit, OnDestroy {
  temperature: number = 0;
  temperatureF: number = 0;
  temperatureK: number = 0;
  status: string = 'Normal';
  message: string = '';
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private subscription?: Subscription;


  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.connect();
    this.socketService.subscribe('1'); // Assuming helmet_id is '1'

    this.subscription = this.socketService.onSensorUpdate().subscribe(
      (data: SensorData) => {
        const temperatureSensor = data.sensors.find(sensor => sensor.tipo === "temperatura");
        if (temperatureSensor) {
          this.temperature = temperatureSensor.info_sensor.valor;
          this.temperatureF = (this.temperature * 9/5) + 32;
          this.temperatureK = this.temperature + 273.15;
          
          this.updateStatus();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  private updateStatus() {
    if (this.temperature > 38) {
      this.status = 'Peligro';
      this.message = 'La Temperatura ha superado el límite seguro';
    } else if (this.temperature > 37) {
      this.status = 'Advertencia';
      this.message = 'La Temperatura está cerca del límite seguro';
    } else {
      this.status = 'Normal';
      this.message = '';
    }
  }

  toggleMenu() {
    this.sidenav.toggle();
  }
  
}