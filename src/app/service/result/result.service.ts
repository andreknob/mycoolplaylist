import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private _tracksAreSet: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);
  private _playlistTracks: Array<Object>;

  constructor() { }

  get playlistTracks(): Array<Object> {
    return this._playlistTracks;
  }

  set playlistTracks(playlistTracks: Array<Object>) {
    this._playlistTracks = playlistTracks;
    this._tracksAreSet.next(playlistTracks !== undefined);
  }

  get tracksAreSet(): Observable<Boolean> {
    return this._tracksAreSet.asObservable();
  }
}
