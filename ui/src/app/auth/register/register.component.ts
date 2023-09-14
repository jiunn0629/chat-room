import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  public form: FormGroup | undefined;
  @ViewChild ('passwordInput', {static: false}) passwordInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private toastService: ToastService,

      private router: Router
  ) {
  }

  ngOnInit() {
    this.onInitForm();
  }

  private onInitForm() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['',[Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

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

  public onRegister(){
    this.form?.markAllAsTouched();
    if (this.form?.invalid) {
      return;
    }
    this.authService.register(this.form?.value).pipe(take(1)).subscribe({
      next: res => {
        if (res.isSuccess) {
          this.toastService.showSuccess({title: '成功'});
          this.toastService.showQuestion({title: '登入嗎?', text: '現在要登入嗎?'})?.then(
              res => {
                if (res.isConfirmed) {
                  this.router.navigate(['/login']);
                } else {
                  return;
                }
              }
          )

        } else {
          this.toastService.showWarning({title: '警告', text: res.message});
        }
      },
      error: err => {
        this.toastService.showError({title: err.title, text: err.text});
      }
    })
  }
}
