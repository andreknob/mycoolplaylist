import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Http, Headers } from '@angular/http';
import User from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _authenticated: Boolean = false;

  constructor(private http: Http) { }

  getUserInfo() {
    return this.http.get(`${environment.address}/api/user/me`,
      {headers: new Headers({'x-access-token': localStorage.getItem('jwt')})}
    );
  }

  setUser(newUser) {
    this._user.next(newUser);
  }

  getUser(): Observable<User> {
    return this._user.asObservable();
  }

  setAuthenticated(authenticated) {
    this._authenticated = authenticated;
  }

  getAuthenticated(): Boolean {
    return this._authenticated;
  }
}
