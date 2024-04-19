import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  }
]



@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ]
})
export class OrdersModule { }
