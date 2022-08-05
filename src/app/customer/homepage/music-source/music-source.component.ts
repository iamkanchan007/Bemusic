import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'music-source',
  templateUrl: './music-source.component.html',
  styleUrls: ['./music-source.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicSourceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
