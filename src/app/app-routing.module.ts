import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { SettingComponent } from './views/pages/setting/setting.component';


const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./views/pages/setting/setting.module').then(m => m.SettingModule)
      },
    
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
 
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
