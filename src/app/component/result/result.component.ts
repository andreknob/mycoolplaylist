import { Component } from '@angular/core';
import { ResultService } from 'src/app/service/result/result.service';
import { WebAPIService } from 'src/app/service/spotify/web-api/web-api.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent {

  private _playlistTitle;
  private _playlistTracks;
  private _playlistState;
  private _displayTracks;
  private _tracksUris;


  constructor(private resultService: ResultService, private webApiService: WebAPIService) {
    this._playlistTracks = this.resultService.playlistTracks || [];

    this._tracksUris = [];
    this._displayTracks = [];
    this._playlistTracks.forEach(track => {
      this._tracksUris.push(track.uri);
      this._displayTracks.push({artist: track.artists[0].name, name: track.name});
    });

    this.playlistTitle = 'My cool playlist';
  }

  saveToSpotify() {
    this.webApiService.createPlaylist(this._tracksUris).subscribe(data => {
      console.log(JSON.parse(data.text()));
    },
      error => console.log(error)
    );
  }

  set playlistTitle(playlistTitle: string) {
    this._playlistTitle = playlistTitle;
  }

  get playlistTitle(): string {
    return this._playlistTitle;
  }

  set playlistState(playlistState: string) {
    this._playlistState = playlistState;
  }

  get playlistState(): string {
    return this._playlistState;
  }
}
