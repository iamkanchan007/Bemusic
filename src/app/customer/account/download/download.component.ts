import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
