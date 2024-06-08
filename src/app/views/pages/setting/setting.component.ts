import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from "src/app/services/app/permission.service";
import { PermissionsList } from "src/app/shared/interfaces/permission.config";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
 

  ngOnInit(): void {
    // this.checkPermission();
   
  }
  constructor(private modalService: NgbModal,    public permissionService: PermissionService,) { }


  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }



  Setting: any = { User_Mangement: true, role_Mangement: true };
  async checkPermission() {
    this.Setting.role_Mangement = await this.permissionService.checkPermission(PermissionsList.role_view);
    this.Setting.User_Mangement = await this.permissionService.checkPermission(PermissionsList.user_view);
  }





}
