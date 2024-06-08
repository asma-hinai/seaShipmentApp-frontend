import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  NgbModal,
  NgbActiveModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
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
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  @ViewChild("lgModal") lgModal: TemplateRef<any>;
  private modalRef: NgbModalRef;

  isEditUser = false;
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
  isLoading = false;
  usersData: any = [];
  RolesName: any = [];
  currentPage: any = 1;
  pageSize: any = 10;
  UserForm: FormGroup;
  userId: number;
  RoleValue = 2;
  RoleOptions = [
    { label: "مستخدم", value: 1 },
    { label: "مدير", value: 2 },
    { label: "approver", value: 3 },
  ];

  tableColumns = [
    {
      header: "اسم الموظف",
      field: "userName",
      type: "text",
      functionObject: null,
    },
    {
      header: "البريد الإلكتروني",
      field: "email",
      type: "text",
      functionObject: null,
    },
    {
      header: "المهام",
      field: "role",
      type: "text",
      functionObject: null,
    },

    {
      header: "الإجراء",
      field: "actions",
      type: "function",
      functionObject: [
        {
          label: "edit",
          action: (action: any, data: any) => this.editUser(action, data),
        },
        {
          label: "delete",
          action: (action: any, data: any) => this.deleteUser(action, data),
        },
      ],
    },
  ];



  ngOnInit(): void {
    this.getUsers();
    this.initForm();
    this.getRolesName();
  }



  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingService,
    private fb: FormBuilder
  ) {}

  openLgModal() {
    this.UserForm.reset();
    this.isEditUser = false;
    this.modalRef = this.modalService.open(this.lgModal, { size: "lg" });
  }

  initForm() {
    this.UserForm = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      role: [null, [Validators.required]],
    });
  }

  getUsers() {
    let params = {
      currentPage: 1,
      pageSize: 10,
    };
    this.isLoading = true;
    this.settingService.getUsers(params).subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.usersData = res.data.users;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

  getRolesName() {
    this.isLoading = true;
    this.settingService.getRolesName().subscribe(
      async (res: any) => {
        this.isLoading = false;
        this.RolesName = res.data;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

  editUser(action: any, data: any) {
    this.openLgModal();
    this.userId = data.id;
    console.log(data);
    this.isEditUser = true;

    this.UserForm.setValue({
      name: data.userName ?? null,
      email: data.email ?? null,
      role: data.role ?? null,
    });
  }

  deleteUser(action: any, data: any) {
    
    console.log(data);
    Swal.fire({
      title: "هل أنت متأكد",
      text: "تريد حذف هذا المستخدم",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "إغلاق",
    }).then((result) => {
 
      if (result.isConfirmed) {

        this.settingService.deleteUser(data.id).subscribe(
          (res: any) => {
            this.getUsers()
            Swal.fire({
              title: "ممتاز!",
              text: "تم حذف المستخدم بنجاح.",
              icon: "success",
            });
          }, err => {
            Swal.fire({
              timer: 3000, 
              title: "Error!",
              text: err.error.description,
              icon: "error",
            });
          }
        );
    
      
      }
    });
  }


  AddUpdateUser(): void {
    for (const i in this.UserForm.controls) {
      if (this.UserForm.controls.hasOwnProperty(i)) {
        this.UserForm.controls[i].markAsDirty();
        this.UserForm.controls[i].updateValueAndValidity();
      }
    }

    if (this.UserForm.valid) {
      if (!this.isEditUser) {
        let params = {
          userName: this.UserForm.value.name,
          email: this.UserForm.value.email,
          role: this.UserForm.value.role,
        };

        console.log(params);
        this.settingService.addUser(params).subscribe(
          async (res: any) => {
            this.isLoading = false;
            this.getUsers();
            this.closeModal();
            this.usersData = res;
            this.UserForm.reset();
            Swal.fire({
              timer: 3000, 
              title: "ممتاز!",
              text: res.description,
              icon: "success",
            });
          },
          (err: { error: { code: number; description: string } }) => {
            this.isLoading = false;
          

            Swal.fire({
              timer: 3000, 
              title: "Error!",
              text: err.error.description,
              icon: "error",
            });

          }
        );
      } else {
        let params = {
          userName: this.UserForm.value.name,
          email: this.UserForm.value.email,
          generatePassword: true,
          role: this.UserForm.value.role,
        };

        this.settingService.editUser(params, this.userId).subscribe(
          async (res: any) => {
            this.isLoading = false;
            this.usersData = res;
            this.getUsers();
            this.UserForm.reset();
            this.closeModal();
            Swal.fire({
              timer: 3000, 
              title: "ممتاز!",
              text: res.description,
              icon: "success",
            });
            
          },
          (err: { error: { code: number ,description :any} }) => {
            this.isLoading = false;
           
            Swal.fire({
              timer: 3000, 
              title: "Error!",
              text: err.error.description,
              icon: "error",
            });
          }
        );
      }
    }
  }

  closeModal() {

    if (this.modalRef) {
      this.modalRef.close();
    }
    this.UserForm.reset();
  }
}
