import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

  constructor(private http: Http) {
  }

  getPlaylistFromTopArtists() {
    return this.http.get(`${environment.address}/api/spotify/playlistFromTopArtists`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  getPlaylistFromArtist(artistId) {
    return this.http.get(`${environment.address}/api/spotify/playlistFromArtist/${artistId}`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  getSpotifyUserInfo() {
    return this.http.get(`${environment.address}/api/spotify/me`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  search(searchTerm = '') {
    return this.http.get(`${environment.address}/api/spotify/search/${encodeURI(searchTerm)}`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  createPlaylist(playlistObj) {
    return this.http.post(`${environment.address}/api/spotify/createPlaylist`,
      JSON.stringify(playlistObj),
      {headers: new Headers({'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('jwt')})}
    );
  }
}
