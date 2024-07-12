import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CrudInicioComponent } from './crud-inicio/crud-inicio.component';
import { Editar1Component } from './editar1/editar1.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { InicioComponent } from './inicio/inicio.component';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SensoresComponent } from './sensores/sensores.component';
import { TemperaturaComponent } from './temperatura/temperatura.component';
import { GasTierraComponent } from './gas-tierra/gas-tierra.component'; 



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegistrarComponent,
    Editar1Component,
    CrudInicioComponent,
    SensoresComponent,
    TemperaturaComponent,
    GasTierraComponent
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

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
