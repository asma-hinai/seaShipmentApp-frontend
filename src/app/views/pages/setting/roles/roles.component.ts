import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
  roleForm: FormGroup;
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
  isLoading = false;
  RolesData: any = [];
  permissionsData: any = [];
  currentPage: any = 1;
  pageSize: any = 10;
  tableColumns = [
    {
      header: "المهمة",
      field: "userName",
      type: "text",
      functionObject: null,
    },
    {
      header: "الوصف",
      field: "email",
      type: "text",
      functionObject: null,
    },
    {
      header: "الصلاحيات",
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
          action: (invoice: any, type: any) => this.editRole(invoice, type),
        },
        {
          label: "delete",
          action: (invoice: any, type: any) => this.deleteRole(invoice, type),
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.simpleItems = [true, "Two", 3];
    this.getRole();
    this.getPermissions();
  }
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingService,
    private fb: FormBuilder
  ) {}


  initForm(){
    this.roleForm = this.fb.group({
      CashiersName: [null, [Validators.required]],

    });
  }

  openLgModal(content: TemplateRef<any>) {
    this.modalService
      .open(content, { size: "lg" })
      .result.then((result) => {
        console.log("Modal closed" + result);
      })
      .catch((res) => {});
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
        this.RolesData = res;
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
        this.permissionsData = res;
      },
      (err: { error: { code: number } }) => {
        this.isLoading = false;
      }
    );
  }

  editRole(invoice: any, type: any) {}
  deleteRole(invoice: any, type: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }
}
