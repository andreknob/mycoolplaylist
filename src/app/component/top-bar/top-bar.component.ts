import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WindowRefService } from '../../service/window/window-ref.service';
import { UserService } from 'src/app/service/user/user.service';
import { Subscription } from 'rxjs';
import User from 'src/app/model/user';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  providers: [AuthorizationService]
})
export class TopBarComponent implements OnInit, OnDestroy {

  _user: User;
  subscription: Subscription;

  constructor(private authorizationService: AuthorizationService, private userService: UserService,
    private windowRefService: WindowRefService) {
  }

  ngOnInit() {
    this.subscription = this.userService.getUser().subscribe(user => {
      this._user = user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
}
