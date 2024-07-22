import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './auth.guard';
import { RegistrarComponent } from './registrar/registrar.component';
import { Editar1Component } from './editar1/editar1.component';
import { CrudInicioComponent } from './crud-inicio/crud-inicio.component';
import { SensoresComponent } from './sensores/sensores.component';
import { TemperaturaComponent } from './temperatura/temperatura.component';
import { GasTierraComponent } from './gas-tierra/gas-tierra.component';
import { AuthProtectedGuard } from './auth-protected.guard';
import { InfoEmpleadoComponent } from './info-empleado/info-empleado.component';
import { EliminarEmpleadoComponent } from './eliminar-empleado/eliminar-empleado.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [

  {
    path: '', component: InicioComponent, canActivate: [AuthGuard]
  },

  {
    path: 'registrar', component: RegistrarComponent, canActivate: [AuthProtectedGuard]
  },

  {
    path: 'editar', component: Editar1Component, canActivate: [AuthProtectedGuard]
  },
  {
    path: 'crud', component: CrudInicioComponent, canActivate: [AuthProtectedGuard]
  },
  {
    path: 'sensores/:id', component: SensoresComponent, canActivate:[AuthProtectedGuard]
  },
  {
    path: 'temperatura', component: TemperaturaComponent, canActivate:[AuthProtectedGuard]
  },
  {
    path: 'gas-tierra', component: GasTierraComponent, canActivate:[AuthProtectedGuard]
  },
  {
    path:'editar-empleado/:id', component: InfoEmpleadoComponent, canActivate: [AuthProtectedGuard]
  },
  {
    path: 'eliminar', component: EliminarEmpleadoComponent, canActivate: [AuthProtectedGuard]
  },
  {
    path: 'home', component: EmpleadosComponent, canActivate: [AuthProtectedGuard]
  },
  {
    path: '**', component: NotFoundComponent, canActivate: []
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
