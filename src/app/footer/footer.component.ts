import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from '@common/auth/current-user';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {
  @Input() footerLines = {
    company:"Company",
    policy:"Policy",
    follow:"Follow Us",
    about:"About Us",
    faq:"FAQ",
    contact:"Contact Us",
    privacy:"Privacy Policy",
    terms:"Terms of Service",
    refund:"Refund Policy",
    copyrights:"© 2021 DJ Mixing Lab | All Rights Reserved"
};
@Input() isAdmin:boolean=false;
  constructor(private router: Router, public user: CurrentUser) { }

  ngOnInit(): void {
  }

  isTournamentRoute() {
    var url = window.location.href;

    return (url.indexOf('admin') !== -1);
  }  
}
