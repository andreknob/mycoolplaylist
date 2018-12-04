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
  private loading = false;
  private created = false;
  private icon = 'fab fa-spotify';
  private resultMsg = '';

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

  saveToSpotify = () => {
    const playlistObj = {
      title: this.playlistTitle,
      state: this.playlistState,
      playlist: this.tracksUris,
    };
    this.loading = true;
    this.icon = 'fas fa-circle-notch fa-spin';
    this.webApiService.createPlaylist(playlistObj).subscribe(data => {
      console.log(JSON.parse(data.text()));
      this.resultMsg = 'Saved to your spotify account!';
      this.created = true;
    }, error => {
      console.log(error);
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
