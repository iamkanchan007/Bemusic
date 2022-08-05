import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../current-user';
import {BackendErrorResponse} from '@common/core/types/backend-error-response';
import {Toast} from '@common/core/ui/toast.service';
import { Country, State, City }  from 'country-state-city';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDatepicker} from '@angular/material/datepicker';
@Component({
  selector: 'complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompleteProfileComponent implements OnInit {
  public form:FormGroup;
  public addressForm:FormGroup;
  djTypes: any=[];
  cuser:any;
  public currentUserId;
  states: any=[];
  countries: any=[];
  allStates: any=[];
  isdisable = false;
  inputTelOptions:any={initialCountry: 'in',separateDialCode:true};
  dialCode: any=91;
  constructor(
      public user: CurrentUser,
      public fb: FormBuilder,
      public auth: AuthService,
      private toast: Toast,
      protected router: Router,
    ) { 
      this.allStates=State.getAllStates();
      this.countries=Country.getAllCountries();
      console.log(this.states);
      user.model$.subscribe(values => this.currentUserId = values.id);
      this.cuser=this.user.getModel();
      console.log(this.cuser);
    }

  ngOnInit(): void {
    let regular = this.cuser.regular_perform_location?.split(',');
    console.log("hello world", regular);
    this.form = this.fb.group({
        first_name: new FormControl(this.cuser.first_name, Validators.required),
        last_name: new FormControl(this.cuser.last_name, Validators.required),
        dob: new FormControl(this.cuser.dob),
        //user_name: new FormControl(this.cuser.display_name, Validators.required),
        //company: new FormControl(this.cuser.company),
        djname: new FormControl(this.cuser.djname, Validators.required),
        email: new FormControl(this.cuser.email, Validators.compose([
            Validators.required,
            Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
        ])),
        phone: new FormControl(this.cuser.phone, Validators.compose([Validators.required, Validators.maxLength(10)])),
        djtype: new FormControl(this.cuser.djtype?this.cuser.djtype:'', Validators.required),
        regular_perform_location: this.fb.array(
          [
            new FormControl(regular != undefined && regular.length > 0 && regular[0] ? regular[0] : '', Validators.required),
            new FormControl(regular != undefined && regular.length > 0 && regular[1] ? regular[1] : '', Validators.required),
            new FormControl(regular != undefined && regular.length > 0 && regular[2] ? regular[2] : '', Validators.required)
          ]
        ),
        number_of_people_perform_weekly: new FormControl(this.cuser.number_of_people_perform_weekly,Validators.compose([Validators.required, Validators.max(6), Validators.min(0)])),
        website:new FormControl(this.cuser.website),
        instagram: new FormControl(this.cuser.instagram),
        facebook: new FormControl(this.cuser.facebook),
        twitter: new FormControl(this.cuser.twitter),
    });
    this.addressForm= this.fb.group({
        address: new FormControl(this.cuser.address, Validators.required),
        suit_apt: new FormControl(this.cuser.suit_apt),
        country: new FormControl(this.cuser.country?this.cuser.country:'', Validators.required),
        state:new FormControl(this.cuser.state, Validators.required),
        city: new FormControl(this.cuser.city, Validators.required),
        zipcode: new FormControl(this.cuser.zipcode, Validators.required),
    });
    this.getDjtypes();
    if(this.cuser.country){
      this.getStates(this.cuser.country);
    }
  }
  public toggleDatePicker(datePicker: MatDatepicker<Date>) {
        if (datePicker.opened) {
            datePicker.close();
        } else {
            datePicker.open();
        }
    }
  getDjtypes(){
      this.auth.djTypes().subscribe((res:any)=>{
        if(res.status==='success'){
            this.djTypes=res.djtypes;
        }
      })
  }
  get regular_perform_location(): FormArray {
    return this.form.get('regular_perform_location') as FormArray;
  }

  getValidity(i) {
    return (<FormArray>this.form.get('regular_perform_location')).controls[i].invalid;
  }
  save(){ 
    console.log(this.form.getRawValue());
    this.auth.completeProfile(this.form.getRawValue(), this.currentUserId)
    .subscribe((response:any) => {
      if (response.status === 'success') {
        localStorage.setItem("cuser",JSON.stringify(response.user));
        this.user.init({ user: response.user, guestsRole: this.cuser.roles[0] });
        this.toast.open('Profile detail successfully sent.');
      }else{
        this.toast.open('Something went wrong.');
      }
    }, (errResponse: BackendErrorResponse) =>{
        this.toast.open(errResponse.message, {duration: 6000});
    });
  }
  saveAddress(){
    console.log(this.addressForm.getRawValue());
    this.auth.addressDetail(this.addressForm.getRawValue(), this.currentUserId)
    .subscribe((response:any) => {
        if (response.status === 'success') {
          response.user.profile_complete=true;
          localStorage.setItem("cuser",JSON.stringify(response.user));          
          this.cuser.profile_complete=true;
          this.user.init({ user: response.user, guestsRole: this.cuser.roles[0] });
          this.toast.open('Address detail successfully sent.');
        }else{
          this.toast.open('Something went wrong.');
        }
    }, (errResponse: BackendErrorResponse) =>{
        this.toast.open(errResponse.message, {duration: 6000});
    });
  }
  getStates(cname){
    let index=this.countries.findIndex(res=>res.name===cname);
    if(index>=0){
      this.states=this.allStates.filter(res=>res.countryCode===this.countries[index].isoCode);
    }
  }


  checkCompleteProfile(){
    this.isdisable = true;
    this.auth.isProfileComplete(this.cuser.id).subscribe((res:any)=>{
        if(res.status==='success'){
            if(res.profile_complete){
              this.router.navigate(['/web/billing/upgrade']);
            } else {
              this.toast.open('Please complete your profile first!');
            }
            //this.djTypes=res.djtypes;
        } else {
          this.toast.open('Something went wrong');
        }
      })
     this.isdisable = false;
  }
  countryChange(val){
    this.dialCode=val.dialCode;
  }
}
