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
    private fb: FormBuilder
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
  }
  
  onLogin(): void {
    for (const i in this.LgginForm.controls) {
      if (this.LgginForm.controls.hasOwnProperty(i)) {
        this.LgginForm.controls[i].markAsDirty();
        this.LgginForm.controls[i].updateValueAndValidity();
      }
    }

 
    let params = {
      userName: this.LgginForm.value.email,
      password: this.LgginForm.value.password,
    };

    if (!this.LgginForm.invalid) {
      this.isLoading = true;
      this.authService.login(params).subscribe(
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
