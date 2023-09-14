import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {first, take} from "rxjs";
import {Router} from "@angular/router";
import {SnackbarService} from "../../shared/services/snackbar.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  public form: FormGroup | undefined;
  private snackbarService: SnackbarService = inject(SnackbarService);
  @ViewChild ('passwordInput', {static: false}) passwordInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
      private fb: FormBuilder,
      private authService: AuthService,
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
          this.snackbarService.open('註冊成功，要現在登入嗎?','確認', {...this.snackbarService.snackbarSuccessConfig,duration: 5000});
          const ref = this.snackbarService.snackbarRef;
          ref?.onAction().pipe(first()).subscribe(() => {
            this.router.navigate(['/login']);
            ref?.dismissWithAction();
          });
        } else {
          this.snackbarService.open(res.message, '關閉', this.snackbarService.snackbarErrorConfig);
        }
      },
      error: err => {
        this.snackbarService.open(err.text, '關閉', this.snackbarService.snackbarErrorConfig);
      }
    })
  }
}
