import { Component } from '@angular/core';
import { ResultService } from 'src/app/service/result/result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {

  private _playlistTracks;
  private _displayTracks;

  constructor(private resultService: ResultService) {
    this._playlistTracks = this.resultService.playlistTracks || [];

    this._displayTracks = [];
    this._playlistTracks.forEach(track => {
      this._displayTracks.push({artist: track.artists[0].name, name: track.name});
    });
  }
}
