import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  private _displayTracks;
  private tracksUris;
  private loading = false;
  private _created = false;
  private icon = 'fab fa-spotify';
  private _resultMsg = '';
  private _showContainer: Boolean = false;

  constructor(private router: Router, private resultService: ResultService, private webApiService: WebAPIService) {
    this.playlistTracks = this.resultService.playlistTracks;

    if (!this.playlistTracks) {
      this.router.navigate(['']);
      return;
    }

    this.tracksUris = [];
    this._displayTracks = [];
    this.playlistTracks.forEach(track => {
      this.tracksUris.push(track.uri);
      this._displayTracks.push({artist: track.artists[0].name, name: track.name});
    });

    this.playlistTitle = 'My cool playlist';

    setTimeout(() => {
      this.showContainer = true;
    }, 500);
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

  set showContainer(value) {
    this._showContainer = value;
  }

  get showContainer() {
    return this._showContainer;
  }

  get displayTracks() {
    return this._displayTracks;
  }

  set created(value) {
    this._created = value;
  }

  get created() {
    return this._created;
  }

  set resultMsg(value) {
    this._resultMsg = value;
  }

  get resultMsg() {
    return this._resultMsg;
  }
}
