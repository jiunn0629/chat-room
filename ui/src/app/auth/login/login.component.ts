import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {take} from "rxjs";
import {Router} from "@angular/router";
import {SnackbarService} from "../../shared/services/snackbar.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public form: FormGroup | undefined;
    private snackbarService: SnackbarService = inject(SnackbarService);
    @ViewChild('passwordInput', {static: false}) passwordInput: ElementRef<HTMLInputElement> | undefined;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.onInitForm();
    }

    private onInitForm() {
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
                    this.snackbarService.open('已登入', '',this.snackbarService.snackbarSuccessConfig);
                    this.router.navigate(['../../pages/chats']);
                } else {
                    this.snackbarService.open(res.message,'',this.snackbarService.snackbarErrorConfig);
                }
            },
            error: err => {
                this.snackbarService.open(err.text,'',this.snackbarService.snackbarErrorConfig);
            }
        })
    }
}
