import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { Editar1Component } from './editar1/editar1.component';
import { SensoresComponent } from './sensores/sensores.component';
import { TemperaturaComponent } from './temperatura/temperatura.component';
import { GasTierraComponent } from './gas-tierra/gas-tierra.component';
import { InfoEmpleadoComponent } from './info-empleado/info-empleado.component';
import { EliminarEmpleadoComponent } from './eliminar-empleado/eliminar-empleado.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { CascoComponent } from './casco/casco.component';
import { GpsComponent } from './gps/gps.component';
import { CamaraComponent } from './camara/camara.component';
import { RegisterAddressComponent } from './register-address/register-address.component';
import { AmbienteComponent } from './ambiente/ambiente.component';
import { AuthProtectedGuard } from './auth-protected.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeEmpComponent } from './home-emp/home-emp.component';
import { PasswordComponent } from './password/password.component';
import { VerificationPasswordComponent } from './verification-password/verification-password.component';
import { SensorHistoryComponent } from './sensor-history/sensor-history.component';
import { GpsEmpComponent } from './gps-emp/gps-emp.component';
import { AmbienteEmpComponent } from './ambiente-emp/ambiente-emp.component';
import { TemperaturaEmpComponent } from './temperatura-emp/temperatura-emp.component';
import { CamaraEmpComponent } from './camara-emp/camara-emp.component';
import { PerfilEmpleadoComponent } from './perfil-empleado/perfil-empleado.component';
import { VerificacionComponent } from './verificacion/verificacion.component';

const routes: Routes = [
  {
    path: '', 
    component: InicioComponent
  },
  {
    path: 'camara/:cameraLink',
    component: CamaraComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'registrar',
    component: RegistrarComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'editar',
    component: Editar1Component,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'sensores/:id',
    component: SensoresComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'temperatura',
    component: TemperaturaComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'gas-tierra',
    component: GasTierraComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'editar-empleado/:id',
    component: InfoEmpleadoComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'eliminar',
    component: EliminarEmpleadoComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'empleados',
    component: EmpleadosComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'casco',
    component: CascoComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'gps/:id',
    component: GpsComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'address',
    component: RegisterAddressComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'ambiente',
    component: AmbienteComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'unauthorized',
    component: NotFoundComponent,
    canActivate: []
  },
  {
    path: 'inicio',
    component: HomeEmpComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['emplo','admin'] }
  },
  {
    path:'password',
    component: PasswordComponent
  },
  {
    path:'verificacion',
    component: VerificationPasswordComponent
  },
  {
    path: 'historial',
    component: SensorHistoryComponent
  },
  {
    path: 'ambiente-emp',
    component: AmbienteEmpComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'gps-emp/:id',
    component: GpsEmpComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'temperatura-emp',
    component: TemperaturaEmpComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },

  {
    path: 'camara-emp/:cameraLink',
    component: CamaraEmpComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'perfil',
    component: PerfilEmpleadoComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin','emplo'] }
  },
  {
    path: 'verificacion/:id/:email',
    component: VerificacionComponent,
    canActivate: [AuthProtectedGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**', 
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }