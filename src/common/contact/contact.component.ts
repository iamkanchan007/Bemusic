import {ChangeDetectionStrategy, Component, OnInit, AfterViewInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Settings} from '../core/config/settings.service';
import {AppHttpClient} from '../core/http/app-http-client.service';
import {Toast} from '../core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {RecaptchaService} from '../core/services/recaptcha.service';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';

@Component({
    selector: 'contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
    //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit, AfterViewInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    public sendData = false;

    public form = new FormGroup({
        full_name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        subject: new FormControl('', Validators.required),
        message: new FormControl('', [Validators.required, Validators.minLength(10)])
        
    });

    public errors$ = new BehaviorSubject<{
        full_name?: string;
        email?: string;
        subject?: string;
        message?: string;
    }>({});

    constructor(
        public settings: Settings,
        private http: AppHttpClient,
        private toast: Toast,
        private router: Router,
        private recaptcha: RecaptchaService,
    ) {}

    ngOnInit() {
        if (this.recaptcha.enabledFor('contact')) {
            this.recaptcha.load();
        }
    }
    ngAfterViewInit(){
        setTimeout(() => {
            let greCaptcha = document.getElementsByClassName("grecaptcha-badge")[0] as HTMLElement;
            greCaptcha.style.visibility="visible";
            greCaptcha.style.opacity='1';    
        }, 3000);
    }
    public async submitMessage() {
        this.loading$.next(true);
        this.sendData = true;

        if (this.recaptcha.enabledFor('contact') && ! await this.recaptcha.verify('contact')) {
            return this.toast.open('Could not verify you are human.');
        }

        this.http.post('contact-page', this.form.value)
            .pipe(finalize(() => {
                this.loading$.next(false);
            })).subscribe(() => {

                this.errors$.next({});
                this.toast.open('Your message has been submitted.');

                let greCaptcha = document.getElementsByClassName("grecaptcha-badge")[0] as HTMLElement;
                greCaptcha.style.visibility="hidden";
                greCaptcha.style.opacity='0';

                this.form.reset();
            }, (errResponse: BackendErrorResponse) => {
                this.toast.open(errResponse.message);
                this.errors$.next(errResponse.errors);
            });
            this.sendData = false;
    }
}
