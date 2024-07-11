import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { AuthGuard } from './auth.guard';
import { RegistrarComponent } from './registrar/registrar.component';
import { Editar1Component } from './editar1/editar1.component';
import { CrudInicioComponent } from './crud-inicio/crud-inicio.component';
import { SensoresComponent } from './sensores/sensores.component';

const routes: Routes = [

  {
    path: '', component: InicioComponent, canActivate: []
  },

  {
    path: 'registrar', component: RegistrarComponent, canActivate: []
  },

  {
    path: 'editar', component: Editar1Component, canActivate: []
  },
  {
    path: 'crud', component: CrudInicioComponent, canActivate: []
  },
  {
    path: 'sensores', component: SensoresComponent, canActivate:[]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
