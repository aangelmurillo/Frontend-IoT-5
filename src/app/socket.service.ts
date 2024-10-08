import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://3.138.244.45');
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  subscribe(helmetId: string) {
    this.socket.emit('subscribe', helmetId);
  }

  onSensorUpdate(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('sensor:update', (data) => {
        observer.next(data);
      });
    });
  }
}