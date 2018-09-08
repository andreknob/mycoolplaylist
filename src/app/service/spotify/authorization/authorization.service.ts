import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: Http) {}

  getAuthorizationPage() {
    return this.http.get('http://localhost:8080/api/spotify/authorize');
  }
}
