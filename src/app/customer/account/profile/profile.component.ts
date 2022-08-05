import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@common/auth/auth.service';
import { DatatableService } from '../../../../common/datatable/datatable.service';
import { Observable } from 'rxjs';
import { Track } from '../../../models/Track';
import { Tracks } from '../../../web-player/tracks/tracks.service';
import { CurrentUser } from '@common/auth/current-user';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { Toast } from '@common/core/ui/toast.service';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
import {MatDatepicker} from '@angular/material/datepicker';
import { countriesnew } from '@common/country-data-store';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatatableService],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  public gaane$ = this.datatable.data$ as Observable<Track[]>;
  public profileForm: FormGroup;
  public addressForm: FormGroup;
  public passwordForm: FormGroup;
  public cuser: any;
  public countriesnew:any = countriesnew
  countries: any = [];
  allStates: any = [];
  djTypes: any = [];
  states: any = [];
  inputTelOptions:any={initialCountry: 'in',separateDialCode:true};
  dialCode: any=91;
  constructor(
    public auth: AuthService,
    public datatable: DatatableService<Track>,
    public tracksService: Tracks,
    public currentUser: CurrentUser,
    public fb: FormBuilder,
    private toast: Toast) {
    
  }

  ngOnInit(): void {
    this.cuser = this.currentUser.getModel();
    this.allStates = State.getAllStates();
    this.countries = Country.getAllCountries();
    let regular = this.cuser.regular_perform_location?.split(',');

    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.profileForm = this.fb.group({
      first_name: new FormControl(this.cuser.first_name, Validators.required),
      last_name: new FormControl(this.cuser.last_name, Validators.required),
      dob: new FormControl(this.cuser.dob),
      // user_name: new FormControl(this.cuser.user_name, Validators.compose([
      //   Validators.maxLength(25),
      //   Validators.minLength(5),
      //   Validators.required,
      //   Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)
      // ])),
      // company: new FormControl(this.cuser.company, Validators.required),
      djname: new FormControl(this.cuser.djname, Validators.required),
      email: new FormControl(this.cuser.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
      ])),
      phone: new FormControl(this.cuser.phone, Validators.compose([Validators.required, Validators.maxLength(10)])),
      djtype: new FormControl(this.cuser.djtype, Validators.required),
      regular_perform_location: this.fb.array(
        [
          new FormControl(regular != undefined && regular.length > 0 && regular[0] ? regular[0] : '', Validators.required),
          new FormControl(regular != undefined && regular.length > 0 && regular[1] ? regular[1] : '', Validators.required),
          new FormControl(regular != undefined && regular.length > 0 && regular[2] ? regular[2] : '', Validators.required)
        ]
      ),
      number_of_people_perform_weekly: new FormControl(this.cuser.number_of_people_perform_weekly, Validators.compose([Validators.required, Validators.max(6), Validators.min(0)])),
      website: new FormControl(this.cuser.website, Validators.pattern(reg)),
      instagram: new FormControl((this.cuser?.links && this.cuser?.links[0]) ? this.cuser?.links[0]?.url : '', Validators.pattern(reg)),
      facebook: new FormControl((this.cuser?.links && this.cuser?.links[1]) ? this.cuser?.links[1]?.url : '', Validators.pattern(reg)),
      twitter: new FormControl((this.cuser?.links && this.cuser?.links[2]) ? this.cuser?.links[2]?.url : '', Validators.pattern(reg)),
    });
    this.addressForm = this.fb.group({
      address: new FormControl(this.cuser.address, Validators.required),
      suite_apt: new FormControl(this.cuser.suite_apt),
      country: new FormControl(this.cuser.country, Validators.required),
      state: new FormControl(this.cuser.state, Validators.required),
      city: new FormControl(this.cuser.city, Validators.required),
      zipcode: new FormControl(this.cuser.zipcode, Validators.required),
    });
    this.passwordForm = this.fb.group({
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    }, { validators: this.checkPasswords });

    this.datatable.init({
      uri: `tracks/${this.currentUser.get('id')}/alldownload`
    });

    this.getDjtypes();
    if (this.cuser.country) {
      this.getStates(this.cuser.country);
    }
  }
  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('new_password').value;
    let confirmPass = group.get('confirm_password').value
    return pass === confirmPass ? null : { notSame: true }
  }
  public toggleDatePicker(datePicker: MatDatepicker<Date>) {
        if (datePicker.opened) {
            datePicker.close();
        } else {
            datePicker.open();
        }
    }
  getArtists(artists){
    let artistsName = [];
    artists.map(v => artistsName.push(v.name));
    return artistsName.join(', ')
    
  }
  getStates(cname) {
    let index = this.countries.findIndex(res => res.name === cname);
    if (index >= 0) {
      this.states = this.allStates.filter(res => res.countryCode === this.countries[index].isoCode);
    }
  }
  getDjtypes() {
    this.auth.djTypes().subscribe((res: any) => {
      if (res.status === 'success') {
        this.djTypes = res.djtypes;
      }
    })
  }
  get regular_perform_location(): FormArray {
    return this.profileForm.get('regular_perform_location') as FormArray;
  }

  getValidity(i) {
    return (<FormArray>this.profileForm.get('regular_perform_location')).controls[i].invalid;
  }
  isDownloaded(count: number, downloads) {
    return downloads.length == 0 ? '' : (downloads[0]?.number_of_times >= count) ? 'text-success' : ''
  }

  save() {
    console.log(this.profileForm.getRawValue());
    this.auth.completeProfile(this.profileForm.getRawValue(), this.currentUser.get('id').toString())
      .subscribe((response: any) => {
        if (response.status === 'success') {
          localStorage.setItem("cuser", JSON.stringify(response.user));
          this.currentUser.init({ user: response.user, guestsRole: this.cuser.roles[0] });
          this.toast.open('Profile detail successfully sent.');
        } else {
          this.toast.open('Something went wrong.');
        }
      }, (errResponse: BackendErrorResponse) => {
        this.toast.open(errResponse.message, { duration: 6000 });
      });
  }
  saveAddress() {
    console.log(this.addressForm.getRawValue());
    this.auth.addressDetail(this.addressForm.getRawValue(), this.currentUser.get('id').toString())
      .subscribe((response: any) => {
        if (response.status === 'success') {
          response.user.profile_complete = true;
          localStorage.setItem("cuser", JSON.stringify(response.user));
          this.cuser.profile_complete = true;
          this.currentUser.init({ user: response.user, guestsRole: this.cuser.roles[0] });
          this.toast.open('Address detail successfully sent.');
        } else {
          this.toast.open('Something went wrong.');
        }
      }, (errResponse: BackendErrorResponse) => {
        this.toast.open(errResponse.message, { duration: 6000 });
      });
  }

  savePassword() {
    this.auth.savePassword(this.passwordForm.getRawValue(), this.currentUser.get('id').toString())
      .subscribe((response: any) => {
        if (response.message === 'success') {
          this.passwordForm.reset();
          this.toast.open('Password changed successfully.');
        } else {
          this.toast.open('Something went wrong.');
        }
      }, (errResponse: BackendErrorResponse) => {
        this.toast.open(errResponse.message, { duration: 6000 });
      });
  }
  countryChange(val){
    this.dialCode=val.dialCode;
  }
}
