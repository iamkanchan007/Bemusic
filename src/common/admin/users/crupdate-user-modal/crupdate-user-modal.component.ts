import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {finalize} from 'rxjs/operators';
import {CurrentUser} from '@common/auth/current-user';
import {User} from '@common/core/types/models/User';
import {Users} from '@common/auth/users.service';
import {Toast} from '@common/core/ui/toast.service';
import {BehaviorSubject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '@common/auth/auth.service';
import {Settings} from '@common/core/config/settings.service';
import {UploadApiConfig} from '@common/uploads/types/upload-api-config';
import {AvatarValidator} from '@common/account-settings/avatar-validator';
import {UploadUri} from '@common/uploads/types/upload-uri.enum';
import {randomString} from '@common/core/utils/random-string';
import {HttpErrors} from '@common/core/http/errors/http-errors.enum';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {environment} from '../../../../environments/environment';
import { Country, State, City }  from 'country-state-city';

export interface CrupdateUserModalData {
    user?: User;
}

@Component({
    selector: 'crupdate-user-modal',
    templateUrl: './crupdate-user-modal.component.html',
    styleUrls: ['./crupdate-user-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrupdateUserModalComponent implements OnInit {
    public loading$ = new BehaviorSubject<boolean>(false);
    djTypes: any=[];
    states: any=[];
    countries: any=[];
    allStates: any=[];
    environment:any=environment;
    public form = this.fb.group({
        email: [''],
        password: [''],
        avatar: [''],
        first_name: [''],
        last_name: [''],
        username: [''],
        company: [''],
        phone: [''],
        djname: [''],
        djtype: [''],
        address: [''],
        suite_apt: [''],
        country: [''],
        dob: [''],
        state: [''],
        city: [''],
        zipcode: [''],
        website: [[]],
        instagram: [''],
        facebook: [''],
        twitter: [''],
        number_of_people_perform_weekly: [0],
        regular_perform_location: [''],
        regular_perform_location1: [''],
        regular_perform_location2: [''],
        email_verified_at: [false],
        available_space: [''],
        roles: [],
        permissions: [],
        is_valid: [true],
    });
    public errors$ = new BehaviorSubject<Partial<User>>({});

    constructor(
        private dialogRef: MatDialogRef<CrupdateUserModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CrupdateUserModalData,
        public users: Users,
        private toast: Toast,
        public currentUser: CurrentUser,
        private fb: FormBuilder,
        private auth: AuthService,
        private settings: Settings,
        private avatarValidator: AvatarValidator,
    ) {
        this.auth.djTypes().subscribe((res:any)=>{
            if(res.status==='success'){
                this.djTypes=res.djtypes;
            }
        });
        this.allStates=State.getAllStates();
        this.countries=Country.getAllCountries();

    }

    ngOnInit() {
        
        if (this.data.user) {
            // password input should always be empty
            this.form.patchValue({
                ...this.data.user,
                password: null,
                email_verified_at: !!this.data.user.email_verified_at
            });
            var regular_perform_location = this.data.user.regular_perform_location;
            var website = this.data.user.websiteData;
            if(regular_perform_location){
                var regular_perform_locationnew = regular_perform_location.split(",");
                this.form.get('regular_perform_location').setValue(regular_perform_locationnew[0]);
                this.form.get('regular_perform_location1').setValue(regular_perform_locationnew[1]);
                this.form.get('regular_perform_location2').setValue(regular_perform_locationnew[2]);
            }
            //this.form.get('website').setValue('');
            if(website){
                website.forEach(data => {
                    if(data.title == 'facebook'){
                        this.form.get('facebook').setValue(data.url);
                    }
                    if(data.title == 'instagram'){
                        this.form.get('instagram').setValue(data.url);
                    }
                    if(data.title == 'twitter'){
                        this.form.get('twitter').setValue(data.url);
                    }
                    if(data.title == 'website'){
                        //this.form.get('website').setValue(data.url);
                    }
                })
            }
            if(this.data.user.country){
              this.getStates(this.data.user.country);
            }
        }
    }
    getDjtypes(){
      
  }
    
    public confirm() {
        if (this.loading$.value) {
            return;
        }
        let request;
        const payload = this.getPayload();

        this.loading$.next(true);

        if (this.data.user) {
            request = this.users.update(this.data.user.id, payload);
        } else {
            request = this.users.create(payload);
        }

        request.pipe(finalize(() => this.loading$.next(false)))
            .subscribe(response => {
                this.close(response.user);
                const action = this.data.user ? 'updated' : 'created';
                this.toast.open('User ' + action);
                location.reload();
            }, (errResponse: BackendErrorResponse) => this.errors$.next(errResponse.errors));
    }
    
    public close(data?: any) {
        this.dialogRef.close(data);
    }
    
    private getPayload() {
        const payload = {...this.form.value};
        payload.roles = (payload.roles || []).map(role => role.id);
        payload.permissions = (payload.permissions || []);
        payload.regular_perform_location = [this.form.get('regular_perform_location').value, this.form.get('regular_perform_location1').value, this.form.get('regular_perform_location2').value];
        if ( ! payload.password) {
            delete payload.password;
        }
        payload.email_verified_at = payload.email_verified_at ? new Date() : null;
        return payload;
    }

    public sendEmailConfirmation() {
        this.loading$.next(true);
        this.auth.resendEmailConfirmation(this.data.user.email)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(() => {
                this.toast.open('Verification email re-sent.');
            }, (errResponse: BackendErrorResponse) => {
                this.toast.open(errResponse.message || HttpErrors.Default);
            });
    }

    public shouldShowResendButton(): boolean {
        return this.data.user &&
            this.data.user.id &&
            this.settings.get('require_email_confirmation') &&
            !this.form.get('email_verified_at').value;
    }

    public avatarUploadConfig(): UploadApiConfig {
        const uri = this.data.user ?
            this.environment.upload_base_url+`users/${this.data.user.id}/avatar` :
            UploadUri.Image;
        return {
            uri: uri,
            mainurl: `users/${this.data.user.id}/avatar`,
            httpParams: {diskPrefix: 'avatars'},
            validator: this.avatarValidator,
        };
    }

    public generateNewPassword() {
        this.form.patchValue({password: randomString(15)});
    }
    getStates(cname){
    let index=this.countries.findIndex(res=>res.name===cname);
    if(index>=0){
      this.states=this.allStates.filter(res=>res.countryCode===this.countries[index].isoCode);
    }
  }
}
