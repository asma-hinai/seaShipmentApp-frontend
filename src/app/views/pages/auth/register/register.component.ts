import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  RegisterForm: FormGroup;
  isLoading: any = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.RegisterForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$'
          ),
        ],
      ]
    });
  }

  onRegister() {
    for (const i in this.RegisterForm.controls) {
      if (this.RegisterForm.controls.hasOwnProperty(i)) {
        this.RegisterForm.controls[i].markAsDirty();
        this.RegisterForm.controls[i].updateValueAndValidity();
      }
    }
    let params = {
      email: this.RegisterForm.value.email,
    };

    if (!this.RegisterForm.invalid) {
      this.isLoading = true;
      this.authService.register(params).subscribe(
        async  (res: any) => {
          this.isLoading = false;
 
          this.router.navigateByUrl("/dashboard");
        },
        (err: { error: { code: number; }; }) => {
       
  
        }
      );
    }
  }

}
