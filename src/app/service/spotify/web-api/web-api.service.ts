import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

  constructor(private http: Http) {}

  getPlaylistFromTopArtists() {
    return this.http.get(`http://localhost:8080/api/spotify/playlistFromTopArtists`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }
}
