import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ngx-custom-validators';
import { NgxMaskModule } from 'ngx-mask';
import { TagInputModule } from 'ngx-chips';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { TableComponent } from 'src/app/shared/templates/table/table.component';



const routes: Routes = [
  {
    path: '',
    component: SettingComponent
  }
]



@NgModule({
  declarations: [
    SettingComponent,
    TableComponent,
    UsersComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,NgxMaskModule,TagInputModule,ReactiveFormsModule,
    RouterModule, 
    CustomFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    NgbDropdownModule,
    NgbDatepickerModule,
    FeatherIconModule
  ]
})
export class SettingModule { }

