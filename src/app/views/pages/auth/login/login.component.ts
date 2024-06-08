import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import Swal from "sweetalert2";
import { PermissionsList } from "src/app/shared/interfaces/permission.config";
import { PermissionService } from "src/app/services/app/permission.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  LgginForm: FormGroup;
  isLoading: any = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    public permissionService: PermissionService,
    private message: NzMessageService,
  ) {}

    ngOnInit(): void {
    this.LgginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'
          ),
        ],
      ],
      password: [null, [Validators.required]],
    });


    let permissionLocalStorge = localStorage.getItem('permission');
    if (permissionLocalStorge) {
      this.router.navigateByUrl("dashboard");
    } 

  }
  



  submitLoginForm(): void {
    for (const i in this.LgginForm.controls) {
      if (this.LgginForm.controls.hasOwnProperty(i)) {
        this.LgginForm.controls[i].markAsDirty();
        this.LgginForm.controls[i].updateValueAndValidity();
      }
    }

 
    let params = {
      email: this.LgginForm.value.email,
      password: this.LgginForm.value.password,
    };

    if (!this.LgginForm.invalid) {
    this.isLoading = true;

    this.authService.login(params).subscribe(
      async  (res: any) => {
        this.isLoading = false;
        this.PermissionsList(res.data.permissions);  
        this.router.navigateByUrl("/dashboard");

      },
      (err) => {


        Swal.fire({
          timer: 3000, 
          title: "Error!",
          text: "تحقق من البريد الاكتروني وكلمة المرور المدخلة",
          icon: "error",
        });
      

      }
    );
    }
  }

 async checkPermission() {
    if (
      await this.permissionService.checkPermission(
        PermissionsList.Business_view
      )
    ) {
    }
  }


  async PermissionsList(data:any) {
    let crpto = await this.permissionService.encryptData(
      JSON.stringify(data)
    );
 
    localStorage.setItem("permission", crpto.toString());
  }




}
