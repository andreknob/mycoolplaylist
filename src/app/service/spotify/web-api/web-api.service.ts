import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

  constructor(private http: Http) {}

  connect() {

  }

  get() {
    return this.http.get('http://localhost:8080/')
    .pipe(map(res => res.json()));
  }

  getTop() {
    return this.http.get('http://localhost:8080/api/spotify/top/tracks',
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }
}
