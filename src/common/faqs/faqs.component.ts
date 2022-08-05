import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
