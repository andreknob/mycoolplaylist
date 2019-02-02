import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WindowRefService } from '../../service/window/window-ref.service';
import { UserService } from 'src/app/service/user/user.service';
import { Subscription } from 'rxjs';
import User from 'src/app/model/user';
import { ResultService } from 'src/app/service/result/result.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  providers: [AuthorizationService]
})
export class TopBarComponent implements OnInit, OnDestroy {

  _user: User;
  userSubscription: Subscription;

  _tracksAreSet: Boolean;
  tracksAreSetSubscription: Subscription;

  authButtonIcon: String;

  constructor(
    private authorizationService: AuthorizationService,
    private userService: UserService,
    private windowRefService: WindowRefService,
    private resultService: ResultService,
    private router: Router) {
      this.authButtonIcon = localStorage.getItem('jwt') !== null ? 'fas fa-circle-notch fa-spin' : 'fab fa-spotify';
  }

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe(user => {
      this._user = user;
    });

    this.tracksAreSetSubscription = this.resultService.tracksAreSet.subscribe(tracksAreSet => {
      this._tracksAreSet = tracksAreSet;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  getAuthorizationPage() {
    this.authorizationService.getAuthorizationPage().subscribe(data => {
        const {nativeWindow} = this.windowRefService;
        nativeWindow.location.href = data.text();
      },
      error => console.log(error)
    );
  }

  openProfile() {
    const {nativeWindow} = this.windowRefService;
    const {externalURLs: {spotify: spotifyURL}} = this._user;

    nativeWindow.open(spotifyURL);
  }

  goToHome() {
    this.router.navigate(['/']);
    this.resultService.playlistTracks = undefined;
  }
}
