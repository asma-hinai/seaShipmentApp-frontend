import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

import { Router, ActivatedRoute } from "@angular/router";
import { SettingService } from "src/app/services/setting.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";


@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  @ViewChild('lgModal') lgModal: TemplateRef<any>;
  private modalRef: NgbModalRef;
  roleForm: FormGroup;
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
  isLoading = false;
  RolesData: any = [];
  permissions: any = [];
  currentPage: any = 1;
  basicModalCloseResult: string = '';
  isNew = false;
  pageSize: any = 10;
  isRoleModelVisible = false;
  final:any=[];
  selectedPermissions: number[] = [];
  User_Permissions:any = [];
  tableColumns = [
    {
      header: "المهمة",
      field: "name",
      type: "text",
      functionObject: null,
    },
    {
      header: "الوصف",
      field: "description",
      type: "text",
      functionObject: null,
    },
    {
      header: "الصلاحيات",
      field: "permissions",
      type: "permissions",
      functionObject: null,
    },

    {
      header: "الإجراء",
      field: "actions",
      type: "function",
      functionObject: [
        {
          label: "edit",
          action: (action: any, data: any) => this.editRole(action, data),
        },
        {
          label: "delete",
          action: (invoice: any, type: any) => this.deleteRole(invoice, type),
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.getRole();
    this.getPermissions();
    this.initForm();
  }

  constructor(
    private modalService: NgbModal,
    private settingService: SettingService,
    private fb: FormBuilder,
 
  ) {}



  initForm(){
    this.roleForm = this.fb.group({
      roleName: [null, [Validators.required]],
      roleDes: [null, [Validators.required]],
    });
  }


  getRole() {
    let params = {
      currentPage: 1,
      pageSize: 10,
    };
    this.isLoading = true;
    this.settingService.getRole(params).subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.RolesData = res.data.roles;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }



  getPermissions() {
    let params = {
      currentPage: 1,
      pageSize: 10,
    };
    this.isLoading = true;
    this.settingService.getPermissions(params).subscribe(
      async (res: any) => {
        this.isLoading = false;
  
        this.permissions = Object.entries(res.data.permissions);
        this.final =res.data.permissions
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }
roleId:number ;
  editRole(action: any, data: any) {
    this.isNew=false;
    this.updateAndFetchPermissions(data.permissions);
    for (var i = 0; i < data.permissions.length; i++) {
      this.User_Permissions.push(data.permissions[i]);
    }
    this.roleId = data.id;
    this.openLgModal()
    this.isRoleModelVisible = true;
    this.roleForm.setValue({
      roleName: data.name ?? null,
      roleDes: data.description ?? null,
    });
  }


  

  getPermissionsiValues(value :any) {
    if (value.selected)
      this.User_Permissions.push(value.code);
    else
      this.removeVal(this.User_Permissions, value.code);

      
  };

  removeVal(arr:any, val:any) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val)
        arr.splice(i, 1);
    }
  }



  deleteRole(action: any, data: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      this.settingService.deleteRole(data.id).subscribe(
        (res: any) => {
          this.getRole()
        
        }, err => {
        }
      );

      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }



  showRoleModal(): void {
    this.roleForm.reset();
    this.isRoleModelVisible = true;
   
  }

  
  

  handleRoleCancel(): void {
    this.isRoleModelVisible = false;
  }

  

  addRole(){
    for (const i in this.roleForm.controls) {
      if (this.roleForm.controls.hasOwnProperty(i)) {
        this.roleForm.controls[i].markAsDirty();
        this.roleForm.controls[i].updateValueAndValidity();
      }
    }

  let params =  {
      "name": this.roleForm.value.roleName,
      "description": this.roleForm.value.roleDes,
      "permissions": this.User_Permissions
    }
    if (!this.roleForm.invalid && this.isNew) {
    this.isLoading = true;
    this.settingService.addRole(params).subscribe(
      (res: any) => {
        this.closeModal() ;
        this.getRole();
     
        Swal.fire({
          timer: 3000, 
          title: "ممتاز!",
          text: "تمت إضافة مهمة جديدة بنجاح",
          icon: "success",
        });

        this.isLoading = false;
        this.roleForm.reset();
        this.User_Permissions = [];
        this.isRoleModelVisible = false;
      },
      (err) => {
        this.isLoading = false;
 

      }
    );
  }
  if (!this.roleForm.invalid && !this.isNew) {
    this.isLoading = true;
    this.settingService.editRole(params ,this.roleId ).subscribe(
      (res: any) => {
        this.closeModal() ;
        this.getRole();
     
        Swal.fire({
          timer: 3000, 
          title: "ممتاز!",
          text: "تمت إضافة مهمة جديدة بنجاح",
          icon: "success",
        });

        this.isLoading = false;
        this.roleForm.reset();
        this.User_Permissions = [];
        this.isRoleModelVisible = false;
      },
      (err) => {
        this.isLoading = false;
 

      }
    );
  }
  }



  AddNewModal() {
    this.isNew = true
    this.roleForm.reset();
    this.getPermissions();
    this.modalRef = this.modalService.open(this.lgModal, { size: 'lg' });
  }

  openLgModal() {
    this.modalRef = this.modalService.open(this.lgModal, { size: 'lg' });
  }

  closeModal() {
    // Check if there's a modal to close
    if (this.modalRef) {
      this.modalRef.close();
    }
  }



  updateSelectedPermissions(targetCodes: number[]): void {
    console.log(this.final)
    Object.values(this.final).forEach((group:any) => {
      group.forEach((permission:any) => {
        if (targetCodes.includes(permission.code)) {
          permission.selected = true;
        }
      });
    });
  }

  fetchSelectedPermissions(): any {
    const selectedPermissions:any = {};
    Object.keys(this.final).forEach((group:any) => {
      selectedPermissions[group] = this.final[group].filter((permission:any) => permission.selected);
    });
    return selectedPermissions;
  }

  updateAndFetchPermissions(targetCodes:any): any {

  
    this.updateSelectedPermissions(targetCodes);
    this.selectedPermissions = this.fetchSelectedPermissions();
    console.log(this.selectedPermissions)
  }



  onCheckboxChange(event: Event, permissionId: number) {
    if ((event.target as HTMLInputElement).checked) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
  }

}
