import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SocialAuthService} from '../social-auth.service';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUser} from '../current-user';
import {BootstrapData, Bootstrapper} from '../../core/bootstrapper.service';
import {Settings} from '../../core/config/settings.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {Toast} from '@common/core/ui/toast.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {filter, finalize} from 'rxjs/operators';
import {User} from '@common/core/types/models/User';
declare var $: any;
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public form:FormGroup;

    public errResponse$ = new BehaviorSubject<Partial<User>>({});

    constructor(
        public fb: FormBuilder,
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        public route: ActivatedRoute,
        private router: Router,
        private user: CurrentUser,
        private bootstrapper: Bootstrapper,
        private toast: Toast,
    ) {
        this.form = this.fb.group({
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
              ])),
            password: new FormControl('', Validators.required),
            remember: new FormControl(true),
        });
        this.hydrateModel();
        this.auth.isLabel=false;
    }

    ngOnInit() {
        $(document).ready(function () {
            $( 'body' ).addClass( "moda" );
            $("#show_hide_password a").on('click', function (event) {
              event.preventDefault();
              if ($('#show_hide_password input').attr("type") == "text") {
                $('#show_hide_password input').attr('type', 'password');
                $('#show_hide_password i').addClass("bi-eye-slash");
                $('#show_hide_password i').removeClass("bi-eye");
              } else if ($('#show_hide_password input').attr("type") == "password") {
                $('#show_hide_password input').attr('type', 'text');
                $('#show_hide_password i').removeClass("bi-eye-slash");
                $('#show_hide_password i').addClass("bi-eye");
              }
            });
          });
        this.auth.forcedEmail$
            .pipe(filter(email => !!email))
            .subscribe(email => {
                this.form.get('email').setValue(email);
                this.form.get('email').disable();
            });
    }

    public login() {
        this.loading$.next(true);
        this.auth.login(this.form.getRawValue())
        .subscribe((response:any) => {
            if (response.status === 'success') {
                const data = JSON.parse(atob(response.data)) as BootstrapData;
                if(data.user.is_valid == false){
                    this.loading$.next(false);
                    this.toast.open('Your account is not approved yet.');
                    return
                }
                this.bootstrapper.bootstrap(response.data);
                localStorage.setItem("cuser",JSON.stringify(data.user));
                this.user.init({ user: data.user, guestsRole: data.user.roles[0] });
                if(this.user.hasRole('admin')){
                    this.settings.isUser$.next(false);
                    this.router.navigateByUrl('/admin');
                    this.toast.open('LoggedIn successfully.');
                }else if(this.user.hasRole('moderator')){
                    this.router.navigateByUrl('/admin/tracks');
                    this.toast.open('LoggedIn successfully.');
                }else{
                        if(data.user.profile_complete == true){
                            this.router.navigate(['/web/dashboard']).then(() => {
                                this.loading$.next(false);
                                this.toast.open('LoggedIn successfully.');
                            });
                        }else{
                            this.router.navigate(['/complete-profile']).then(() => {
                                this.loading$.next(false);
                                this.toast.open('LoggedIn successfully.');
                            });
                        }
                    }
                }else{
                    this.loading$.next(false);
                    this.toast.open(response.message, {duration: 6000});
                }
            }, (errResponse: BackendErrorResponse) =>{
                this.toast.open(errResponse.message, {duration: 6000});
                this.handleLoginError(errResponse)
            }) ;
    }

    private hydrateModel() {
        if ( ! this.settings.get('common.site.demo')) return;

        if (this.settings.get('vebto.demo.email')) {
            this.form.patchValue({
                email: this.settings.get('vebto.demo.email'),
                password: this.settings.get('vebto.demo.password'),
            });
        } else {
            // random number between 0 and 100, padded to 3 digits
            let number = '' + Math.floor(Math.random() * 100);
            number = ('0000' + number).substr(-3, 3);

            this.form.patchValue({
                email: 'admin@demo' + number + '.com',
                password: 'admin'
            });
        }
    }

    private handleLoginError(response: BackendErrorResponse) {
        this.loading$.next(false);
        if (response.errors?.email === 'validation.email_confirmed') {
            this.toast.open('Please confirm your email address.', {action: 'Resend Email', duration: 6000})
                .onAction()
                .subscribe(() => {
                    this.loading$.next(true);
                    this.auth.resendEmailConfirmation(this.form.value.email)
                        .pipe(finalize(() => this.loading$.next(false)))
                        .subscribe(() => {
                            this.toast.open('Confirmation email sent.');
                        });
                });
        } else {
            this.errResponse$.next(response.errors);
        }
    }
    isLabelUser(){
        this.auth.isLabel=!this.auth.isLabel;
        this.form.reset();
    }
}
