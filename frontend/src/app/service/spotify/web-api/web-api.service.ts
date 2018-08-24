import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebAPIService {

  constructor(private http: Http) {}

  connect() {
  }

  get() {
    return this.http.get('')
    .pipe(map(res => res.json()));
  }
}
