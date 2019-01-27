import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: Http) {}

  getAuthorizationPage() {
    return this.http.get(`${environment.address}/api/spotify/authorize`);
  }
}
