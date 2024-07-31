import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { Editar1Component } from './editar1/editar1.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSelectModule } from '@angular/material/select';

import { MatSidenavModule } from '@angular/material/sidenav';

import { MatListModule } from '@angular/material/list';



import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SensoresComponent } from './sensores/sensores.component';
import { TemperaturaComponent } from './temperatura/temperatura.component';
import { GasTierraComponent } from './gas-tierra/gas-tierra.component';
import { InfoEmpleadoComponent } from './info-empleado/info-empleado.component';
import { EliminarEmpleadoComponent } from './eliminar-empleado/eliminar-empleado.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { CamaraComponent } from './camara/camara.component';
import { MenuComponent } from './menu/menu.component';
import { CascoComponent } from './casco/casco.component';
import { GpsComponent } from './gps/gps.component'; 

import { GoogleMapsModule } from '@angular/google-maps';
import { SocketService } from './socket.service';
import { RegisterAddressComponent } from './register-address/register-address.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AmbienteComponent } from './ambiente/ambiente.component';

import { MatDialogModule } from '@angular/material/dialog';
import { HomeEmpComponent } from './home-emp/home-emp.component';
import { SensoresEmpComponent } from './sensores-emp/sensores-emp.component';
import { PasswordComponent } from './password/password.component';
import { VerificationPasswordComponent } from './verification-password/verification-password.component';

import { FormsModule } from '@angular/forms';
import { SensorHistoryComponent } from './sensor-history/sensor-history.component';
import { GpsEmpComponent } from './gps-emp/gps-emp.component';
import { AmbienteEmpComponent } from './ambiente-emp/ambiente-emp.component';
import { TemperaturaEmpComponent } from './temperatura-emp/temperatura-emp.component';
import { CamaraEmpComponent } from './camara-emp/camara-emp.component';
import { PerfilEmpleadoComponent } from './perfil-empleado/perfil-empleado.component';









@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegistrarComponent,
    Editar1Component,
    SensoresComponent,
    TemperaturaComponent,
    GasTierraComponent,
    InfoEmpleadoComponent,
    EliminarEmpleadoComponent,
    EmpleadosComponent,
    CamaraComponent,
    MenuComponent,
    CascoComponent,
    GpsComponent,
    RegisterAddressComponent,
    NotFoundComponent,
    AmbienteComponent,
    HomeEmpComponent,
    SensoresEmpComponent,
    PasswordComponent,
    VerificationPasswordComponent,
    SensorHistoryComponent,
    GpsEmpComponent,
    AmbienteEmpComponent,
    TemperaturaEmpComponent,
    CamaraEmpComponent,
    PerfilEmpleadoComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    GoogleMapsModule,
    MatDialogModule,
    FormsModule,
    MatSidenavModule


  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
