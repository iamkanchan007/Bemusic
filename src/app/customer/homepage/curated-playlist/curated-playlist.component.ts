import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'curated-playlist',
  templateUrl: './curated-playlist.component.html',
  styleUrls: ['./curated-playlist.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuratedPlaylistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
