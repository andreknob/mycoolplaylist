import { Component } from '@angular/core';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WindowRefService } from '../../service/window/window-ref.service';
import User from '../../model/user';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  providers: [AuthorizationService]
})
export class TopBarComponent {

  user: User;

  constructor(private authorizationService: AuthorizationService,
    private windowRefService: WindowRefService) {
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user')) || {};
      }
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
    const {externalURLs: {spotify: spotifyURL}} = this.user;

    nativeWindow.open(spotifyURL);
  }
}
