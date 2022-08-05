import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from '@common/auth/auth.service';
@Component({
  selector: 'disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisclaimerComponent implements OnInit {

  constructor(private auth: AuthService,) { }

  ngOnInit(): void {
  }
 agree(){
   localStorage.setItem('isAgree',JSON.stringify({value:true}));
   this.auth.agree=JSON.parse(localStorage.getItem('isAgree'));
 }
}
