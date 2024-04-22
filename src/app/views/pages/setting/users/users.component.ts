import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';


import { Router, ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  fillJustifyNavCode: any;
  simpleItems: any = [];
  selectedSimpleItem: any = null;
  isLoading = false;
usersData:any = [];
currentPage: any = 1;
pageSize: any = 10;
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
        action: (invoice:any, type:any) =>
          this.editUser(invoice, type),
      },
      {
        label: "delete",
        action: (invoice:any, type:any) =>
          this.deleteUser(invoice, type),
      },
    ],
  },
];

  ngOnInit(): void {
    this.getUsers();
  }
  constructor(
    private modalService: NgbModal,     
    private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingService,
    private fb: FormBuilder
    ) { }


  openLgModal(content: TemplateRef<any>) {
    this.modalService.open(content, {size: 'lg'}).result.then((result) => {
      console.log("Modal closed" + result);
    }).catch((res) => {});
  }


  


  getUsers(){
    let params ={
      currentPage:1,
      pageSize:10
    }
    this.isLoading = true;
    this.settingService.getUsers(params).subscribe(
      async  (res: any) => {
        this.isLoading = false;
        this.usersData = res;
      },
      (err: { error: { code: number; }; }) => {
        this.isLoading = false;

      }
    );
  }

  editUser(invoice: any, type: any){

  }
  deleteUser(invoice: any, type: any){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }
}

