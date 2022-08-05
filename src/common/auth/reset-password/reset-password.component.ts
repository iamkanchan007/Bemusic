import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@common/auth/auth.service';
import { Settings } from '@common/core/config/settings.service';
import { Toast } from '@common/core/ui/toast.service';
import { CurrentUser } from '@common/auth/current-user';
import { BehaviorSubject } from 'rxjs';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    host: { 'class': 'auth-page' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form: FormGroup;

    public errors$ = new BehaviorSubject<{
        email?: string,
        password?: string,
    }>({});

    constructor(
        public auth: AuthService,
        public settings: Settings,
        private route: ActivatedRoute,
        private router: Router,
        private toast: Toast,
        private currentUser: CurrentUser,
        private fb: FormBuilder,
    ) {
        this.form = this.fb.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
            ])),
            token: [''],
            password: new FormControl('', Validators.required),
            confirm_password: new FormControl('', Validators.required),
        }, { validators: this.checkPasswords });
    }
    checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get('password').value;
        let confirmPass = group.get('confirm_password').value
        return pass === confirmPass ? null : { notSame: true }
    }
    public resetPassword() {
        this.loading$.next(true);
        this.form.patchValue({ token: this.route.snapshot.params.token });
        this.auth.resetPassword(this.form.value).subscribe(response => {
            this.currentUser.assignCurrent(response.data);
            this.router.navigate([this.auth.getRedirectUri()]).then(() => {
                this.loading$.next(false);
                this.toast.open('Your password has been reset.');
            });
        }, (errResponse: BackendErrorResponse) => {
            this.errors$.next(errResponse.errors);
            this.loading$.next(false);
        });
    }
}
