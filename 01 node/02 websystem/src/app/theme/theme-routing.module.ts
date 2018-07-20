import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren:
          './pages/default/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'monitor/traffic',
        loadChildren:
          './pages/default/monitor/traffic-monitor/traffic-monitor.module#TrafficMonitorModule'
      },
      {
        path: 'monitor/detect',
        loadChildren:
          './pages/default/monitor/detect-monitor/detect-monitor.module#DetectMonitorModule'
      },
      {
        path: 'monitor/block',
        loadChildren:
          './pages/default/monitor/block-monitor/block-monitor.module#BlockMonitorModule'
      },
      {
        path: 'log/detect',
        loadChildren:
          './pages/default/log/detect-log/detect-log.module#DetectLogModule'
      },
      {
        path: 'log/block',
        loadChildren:
          './pages/default/log/block-log/block-log.module#BlockLogModule'
      },
      {
        path: 'policy/ippool',
        loadChildren:
          './pages/default/policy/ippool/ippool.module#IPPoolModule'
      },
      {
        path: 'policy/pt-editor',
        loadChildren:
          './pages/default/policy/pt-editor/pt-editor.module#PtEditorModule'
      },
      {
        path: 'config/user',
        loadChildren: './pages/default/config/user/user.module#UserModule'
      },
      {
        path: 'header/actions',
        loadChildren:
          './pages/default/header/header-actions/header-actions.module#HeaderActionsModule'
      },
      {
        path: 'header/profile',
        loadChildren:
          './pages/default/header/header-profile/header-profile.module#HeaderProfileModule'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '404',
    loadChildren:
      './pages/self-layout-blank/errors/not-found/not-found.module#NotFoundModule'
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule {}
