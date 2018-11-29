import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

  constructor(private http: Http) {
  }

  getPlaylistFromTopArtists() {
    return this.http.get(`http://localhost:8080/api/spotify/playlistFromTopArtists`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  getPlaylistFromArtist(artistId) {
    return this.http.get(`http://localhost:8080/api/spotify/playlistFromArtist/${artistId}`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  search(searchTerm = '') {
    return this.http.get(`http://localhost:8080/api/spotify/search/${encodeURI(searchTerm)}`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  createPlaylist(playlistObj) {
    return this.http.post(`http://localhost:8080/api/spotify/createPlaylist`,
      JSON.stringify(playlistObj),
      {headers: new Headers({'Content-Type': 'application/json', 'x-access-token': localStorage.getItem('jwt')})}
    );
  }
}
