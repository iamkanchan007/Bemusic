import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'list-section',
  templateUrl: './list-section.component.html',
  styleUrls: ['./list-section.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListSectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
