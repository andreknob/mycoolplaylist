import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: Http) { }

  getUserInfo() {
    return this.http.get('http://localhost:8080/api/user/me',
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }
}
