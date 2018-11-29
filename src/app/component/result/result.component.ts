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
  private _playlistState = 'public';
  private playlistTracks;
  private displayTracks;
  private tracksUris;
  private created = false;
  private loading = false;

  constructor(private resultService: ResultService, private webApiService: WebAPIService) {
    this.playlistTracks = this.resultService.playlistTracks || [];

    this.tracksUris = [];
    this.displayTracks = [];
    this.playlistTracks.forEach(track => {
      this.tracksUris.push(track.uri);
      this.displayTracks.push({artist: track.artists[0].name, name: track.name});
    });

    this.playlistTitle = 'My cool playlist';
  }

  saveToSpotify() {
    this.loading = true;
    const playlistObj = {
      title: this.playlistTitle,
      state: this.playlistState,
      playlist: this.tracksUris,
    };
    this.webApiService.createPlaylist(playlistObj).subscribe(data => {
      console.log(JSON.parse(data.text()));
      this.created = true;
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
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
