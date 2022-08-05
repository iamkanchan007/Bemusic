import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Toast } from '../../core/ui/toast.service';
import { BackendErrorResponse } from '../../core/types/backend-error-response';
import { Router } from '@angular/router';

@Component({
  selector: 'label-register',
  templateUrl: './label-register.component.html',
  styleUrls: ['./label-register.component.scss']
})
export class LabelRegisterComponent implements OnInit {
  public profileForm: FormGroup;
  djTypes: any = [];
  constructor(
    public auth: AuthService,
    public fb: FormBuilder,
    private toast: Toast,
    private router: Router) {
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      user_name: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required,
        Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)
      ])),
      company: new FormControl('', Validators.required),
      djname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
      ])),
      phone: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
      djtype: new FormControl('', Validators.required),
      regular_perform_location: this.fb.array(
        [
          new FormControl('', Validators.required),
          new FormControl('', Validators.required),
          new FormControl('', Validators.required)
        ]
      ),
      number_of_people_perform_weekly: new FormControl('', Validators.compose([Validators.required, , Validators.max(6), Validators.min(0)])),
      website: new FormControl(''),
      instagram: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    }, { validators: this.checkPasswords });

    this.getDjtypes();
  }
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirm_password').value
    return pass === confirmPass ? null : { notSame: true }
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
    this.auth.registerLabel(this.profileForm.getRawValue())
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.router.navigate(['/']).then(() => {
            this.toast.open('Label user request sent.');
          });
        } else {
          this.toast.open('Something went wrong.');
        }
      }, (errResponse: BackendErrorResponse) => {
        this.toast.open(errResponse.message, { duration: 6000 });
      });
  }
}
