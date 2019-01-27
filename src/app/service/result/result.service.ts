import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private _playlistTracks: Array<Object>;

  constructor() { }

  get playlistTracks(): Array<Object> {
    return this._playlistTracks;
  }

  set playlistTracks(playlistTracks: Array<Object>) {
    this._playlistTracks = playlistTracks;
  }
}
