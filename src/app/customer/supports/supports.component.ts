import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from '@common/auth/auth.service';
import { CurrentUser } from '@common/auth/current-user';
import { Toast } from '@common/core/ui/toast.service';
import { BackendErrorResponse } from '@common/core/types/backend-error-response';
@Component({
  selector: 'supports',
  templateUrl: './supports.component.html',
  styleUrls: ['./supports.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportsComponent implements OnInit {
  @ViewChild('closeModal') private closeModal: ElementRef;
  public ticketForm: FormGroup;
  public ticketReasons
  constructor(public fb: FormBuilder,
    public auth: AuthService,
    public currentUser: CurrentUser,
    private toast: Toast
  ) {
    
  }

  ngOnInit(): void {
    this.auth.getTicketReasons().subscribe((res: any) => {
      if(res.status == true){
        this.ticketReasons = res.data
      }
    })
    this.ticketForm = this.fb.group({
      name: new FormControl('', Validators.required),
      reason_id: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-z]{2,4})$')
      ])),
      phone: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10)])),
    });
  }

  generateTicket() {
    this.auth.generateTicket(this.ticketForm.getRawValue(), this.currentUser.get('id').toString())
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.ticketForm.reset();
          this.closeModal.nativeElement.click();      
          this.toast.open('Ticket generated successfully.');
        } else {
          this.toast.open('Something went wrong.');
        }
      }, (errResponse: BackendErrorResponse) => {
        this.toast.open(errResponse.message, { duration: 6000 });
      });
  }
}
