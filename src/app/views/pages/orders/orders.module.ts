import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { NgxMaskModule } from 'ngx-mask';
import { TagInputModule } from 'ngx-chips';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { OrdersComponent } from './orders.component';
import { OrderTableComponent } from 'src/app/shared/templates/order-table/order-table.component';

import { ArchwizardModule } from 'angular-archwizard';
import { OrderWizardComponent } from './order-wizard/order-wizard.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent
  }
]



@NgModule({
  declarations: [OrdersComponent  ,OrderTableComponent, OrderWizardComponent],

  imports: [
    ArchwizardModule,
    NgbModule,
    NgSelectModule,
    NzTableModule,
    NzModalModule,
    NzSelectModule,
    NzRadioModule,
    NzDatePickerModule,
    NzFormModule,
    NzMessageModule,
    NzMessageModule,
    NzButtonModule,
    TagInputModule,
    NgxMaskModule,
    CustomFormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ]
})
export class OrdersModule { }
