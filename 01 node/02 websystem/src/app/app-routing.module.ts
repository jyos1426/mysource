import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './auth/logout/logout.component';
import { AuthGuard } from './auth/_guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'docs',
    canActivate: [AuthGuard],
    loadChildren: './docs/docs.module#DocsModule'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
