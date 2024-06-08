import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import Swal from "sweetalert2";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  form!: FormGroup;
  isLoading: any = false;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'
          ),
        ],
      ],
   
    });
  }


  submitEmailForm(){
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    let params = {
      "email":  this.form.value.email,
    };

    if (!this.form.invalid) {
    this.isLoading = true;

    this.authService.forgetPassword(params).subscribe(
      async  (res: any) => {
        this.isLoading = false;
        Swal.fire({
          timer: 9000, 
          title: "ممتاز!",
          text: "تم إرسال رابط تعيير كلمة المرور عبر البريد الالكتروني",
          icon: "success",
        });

        // this.router.navigateByUrl("/auth/login");

      },
      (err) => {
     
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
