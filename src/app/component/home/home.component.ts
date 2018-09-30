import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WebAPIService } from '../../service/spotify/web-api/web-api.service';
import { WindowRefService } from '../../service/window/window-ref.service';
import User from '../../model/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthorizationService, WebAPIService]
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(private authorizationService: AuthorizationService, private webAPIService: WebAPIService,
    private windowRefService: WindowRefService) {
      this.user = JSON.parse(localStorage.getItem('user')) || {};
  }

  ngOnInit() {
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

  handleClickSearch = () => {
  }

  getTop() {
    this.webAPIService.getTop().subscribe(data => {
        const result = JSON.parse(data.text());
        console.log(result);
      },
      error => console.log(error)
    );
  }

  getRelatedArtists() {
    this.webAPIService.getRelatedArtists().subscribe(data => {
        const result = JSON.parse(data.text());
        console.log(result);
      },
      error => console.log(error)
    );
  }

  getPlaylistFromTopArtists() {
    this.webAPIService.getPlaylistFromTopArtists().subscribe(data => {
        const result = JSON.parse(data.text());
        console.log(result);
      },
      error => console.log(error)
    );
  }
}
