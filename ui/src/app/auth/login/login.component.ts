import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {take} from "rxjs";
import {ToastService} from "../../shared/services/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public form: FormGroup | undefined;
  @ViewChild ('passwordInput', {static: false}) passwordInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private toastService: ToastService,
      private router: Router
  ) {
  }

  ngOnInit(): void {
    this.onInitForm();
  }

  private onInitForm(){
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  };

  public onToggleSeePassword() {
    if (!this.passwordInput) {
      return;
    }
    if (this.passwordInput.nativeElement.type === 'password') {
      this.passwordInput.nativeElement.type = 'text';
    } else {
      this.passwordInput.nativeElement.type = 'password';
    }
  }

  public onLogin() {
    this.form?.markAllAsTouched();
    if (this.form?.invalid) {
      return;
    }
    this.authService.login(this.form?.value).pipe(take(1)).subscribe({
      next: res => {
        if (res.isSuccess) {
          localStorage.setItem('token', res.data['token']);
          localStorage.setItem('userID', res.data['id']);
          this.toastService.showSuccess({title: '成功'});
          this.router.navigate(['../../pages/chats']);
        } else {
          this.toastService.showError({title: '錯誤', text: res.message});
        }
      },
      error: err => {
        this.toastService.showError({title: '錯誤', text: err})
      }
    })
  }
}
