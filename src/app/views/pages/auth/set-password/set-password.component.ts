import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup,FormControl, UntypedFormControl, Validators } from "@angular/forms";
import { NzMessageService } from 'ng-zorro-antd/message';
import { PermissionsList } from "src/app/shared/interfaces/permission.config";
import { PermissionService } from "src/app/services/app/permission.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  form!: FormGroup;
  isLoading: any = false;
  login = true;
  token: string | null = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    public permissionService: PermissionService,
    private message: NzMessageService,
  ) {}

    ngOnInit(): void {
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');

    this.form = this.fb.group({
      password: [null, [Validators.required]], 
      confirmPassword:[null,[Validators.required, this.confirmValidator]],
    });

  }
  
  validateConfirmPassword(): void {
    setTimeout(() => this.form.controls['confirmPassword'].updateValueAndValidity());
  }

  confirmValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.form.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };



  submitResetPassForm(): void {

    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }

     if (this.token) {
      let params = {
        "password": this.form.value.password,
        "confirm": this.form.value.confirmPassword,
        "token": this.token
      };
      if (!this.form.invalid) {
      this.isLoading = true;
      this.authService.setPassword(params).subscribe(
        (res: any) => {
          this.isLoading = false;
          Swal.fire({
            timer: 9000, 
            title: "ممتاز!",
            text: "تم تعيين كلمة مرور جديدة بنجاح",
            icon: "success",
          });
          this.router.navigateByUrl("auth/login");
       
        },
        (err) => {

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




}
