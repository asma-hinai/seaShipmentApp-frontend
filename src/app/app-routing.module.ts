import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { PermissionGuard } from './shared/guard/permission.guard';
import { PermissionsList } from './shared/interfaces/permission.config';
import { ShipmentsComponent } from './views/pages/shipments/shipments.component';
import { ReportsComponent } from './views/pages/reports/reports.component';
const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
  
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: {
          headerDisplay: "none",
          permission: PermissionsList.View
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./views/pages/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'shipments',
        component: ShipmentsComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
    
      { path: '**', redirectTo: 'auth', pathMatch: 'full' }
    ]
  },
 
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
