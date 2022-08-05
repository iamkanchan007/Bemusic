import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {SocialAuthService} from '../social-auth.service';
import {CurrentUser} from '../current-user';
import {ActivatedRoute, Router} from '@angular/router';
import {Settings} from '../../core/config/settings.service';
import {Toast} from '../../core/ui/toast.service';
import {Bootstrapper} from '../../core/bootstrapper.service';
import {RecaptchaService} from '../../core/services/recaptcha.service';
import {FormBuilder, FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {MenuItem} from '@common/core/ui/custom-menu/menu-item';
import {slugifyString} from '@common/core/utils/slugify-string';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {filter} from 'rxjs/operators';
declare var $: any;
function passwordConfirming(c: AbstractControl): any {
    if (!c.parent || !c) { return; }
    const pwd = c.parent.get('password');
    const cpwd = c.parent.get('password_confirmation');
    if (!pwd || !cpwd) { return; }
    if (pwd.value !== cpwd.value) {
      return { invalid: true };
    }
  }
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public registerPolicies: Partial<MenuItem>[] = [];
    public form:FormGroup;
    public errors$ = new BehaviorSubject<{
        email?: string,
        password?: string,
        general?: string,
    }>({});
    public check:boolean=false;
    constructor(
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        public route: ActivatedRoute,
        public user: CurrentUser,
        private router: Router,
        private toast: Toast,
        private bootstrapper: Bootstrapper,
        private recaptcha: RecaptchaService,
        private fb: FormBuilder,
    ) {
        this.auth.isLabel=false;
        this.form = this.fb.group({
            first_name: new FormControl('', Validators.required),
            last_name: new FormControl('', Validators.required),
            email: new FormControl('', Validators.compose([
                Validators.required,
                Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
              ])),
            roles:new FormControl(''),
            password: new FormControl('',Validators.compose([Validators.required, Validators.minLength(6)])),
            password_confirmation:new FormControl('',Validators.compose([Validators.required, passwordConfirming, Validators.minLength(6)])),
           
        });
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
            $("#show_hide_cpassword a").on('click', function (event) {
                event.preventDefault();
                if ($('#show_hide_cpassword input').attr("type") == "text") {
                  $('#show_hide_cpassword input').attr('type', 'password');
                  $('#show_hide_cpassword i').addClass("bi-eye-slash");
                  $('#show_hide_cpassword i').removeClass("bi-eye");
                } else if ($('#show_hide_cpassword input').attr("type") == "password") {
                  $('#show_hide_cpassword input').attr('type', 'text');
                  $('#show_hide_cpassword i').removeClass("bi-eye-slash");
                  $('#show_hide_cpassword i').addClass("bi-eye");
                }
              });
          });
         
        this.registerPolicies = this.settings.getJson('register_policies', []);
        this.registerPolicies.forEach(policy => {
            policy.id = slugifyString(policy.label, '_');
            this.form.addControl(policy.id, new FormControl(false));
        });
        if (this.recaptcha.enabledFor('registration')) {
            this.recaptcha.load();
        }
        this.auth.forcedEmail$
            .pipe(filter(email => !!email))
            .subscribe(email => {
                this.form.get('email').setValue(email);
                this.form.get('email').disable();
            });
    }
    passwordMatchValidator(frm: FormGroup) {
      return frm.controls['password'].value === frm.controls['password_confirmation'].value ? null : { 'mismatch': true };
    }
    public async register() {
        this.loading$.next(true);
        this.form.controls['roles'].setValue(this.auth.isLabel?[3]:[2]);
        if (this.recaptcha.enabledFor('registration') && ! await this.recaptcha.verify('registration')) {
            this.loading$.next(false);
            return this.toast.open('Could not verify you are human.');
        }

        this.auth.register(this.form.getRawValue())
            .subscribe((response:any) => {
              if (response.status === 'success') {
                // this.bootstrapper.bootstrap(response.bootstrapData);
                // localStorage.setItem("cuser",JSON.stringify(response.user));
                // this.user.init({ user: response.user, guestsRole: response.user.roles });
                // this.router.navigate(['/complete-profile']).then(() => {
                //     this.loading$.next(false);
                //     this.toast.open('Registered successfully.');
                // });
                this.router.navigate(['/login']).then(() => {
                    this.loading$.next(false);
                    this.toast.open('Registered successfully.');
                });
            } else {
                        this.loading$.next(false);
                        this.toast.open(response.message, {duration: 6000});
                }
            }, (errResponse: BackendErrorResponse) => {
                this.toast.open('The email has already been taken.');
                this.errors$.next(errResponse.errors);
                this.loading$.next(false);
            });
            
    }
    isLabelUser(){
        this.auth.isLabel=!this.auth.isLabel;
        this.form.reset();
    }
}
