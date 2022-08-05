import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'extensive-library',
  templateUrl: './extensive-library.component.html',
  styleUrls: ['./extensive-library.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensiveLibraryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
