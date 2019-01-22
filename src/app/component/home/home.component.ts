import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WebAPIService } from '../../service/spotify/web-api/web-api.service';
import { UserService } from 'src/app/service/user/user.service';
import { ResultService } from 'src/app/service/result/result.service';
import { WindowRefService } from '../../service/window/window-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [WebAPIService]
})
export class HomeComponent {

  private searching = false;
  private showLoading = false;
  private loadingMsg = '';
  private timeout;
  private topMsg = 'We create a cool playlist for you';

  constructor(private authorizationService: AuthorizationService, private router: Router,
    private webAPIService: WebAPIService, private userService: UserService,
    private resultService: ResultService, private windowRefService: WindowRefService) {
      if (this.userService.getAuthenticated()) {
        this.setUserOnService();
      } else if (localStorage.getItem('jwt') !== null) {
        this.getSpotifyUserInfo();
      }

      if (localStorage.getItem('useTopSongs')) {
        this.getPlaylistFromTopArtists();
        localStorage.removeItem('useTopSongs');
      }
  }

  handleSearch = (searchTerm) => {
    if (localStorage.getItem('jwt') === null) {
      localStorage.setItem('searchTerm', searchTerm);
      return this.getAuthorizationPage();
    }
    return this.webAPIService.search(searchTerm);
  }

  handleSelect = (item) => {
    if (this.searching) {
      return;
    }
    this.setShowLoading();
    this.webAPIService.getPlaylistFromArtist(item.id).subscribe(data => {
        const {playlistTracks} = JSON.parse(data.text());
        this.resultService.playlistTracks = playlistTracks;

        this.router.navigate(['/playlist']);
      },
      error => {
        this.setHideLoading();
        if (error.status === 404) {
          this.topMsg = JSON.parse(error.text()).message;
        }
      }
    );
  }

  getPlaylistFromTopArtists = () => {
    if (this.searching) {
      return;
    }
    if (localStorage.getItem('jwt') === null) {
      localStorage.setItem('useTopSongs', 'true');
      return this.getAuthorizationPage();
    }

    this.setShowLoading();
    this.webAPIService.getPlaylistFromTopArtists().subscribe(data => {
        const {playlistTracks} = JSON.parse(data.text());
        this.resultService.playlistTracks = playlistTracks;
        this.router.navigate(['/playlist']);
      },
      error => console.log(error)
    );
  }

  getSpotifyUserInfo = () => {
    this.webAPIService.getSpotifyUserInfo().subscribe(data => {
        this.setUserOnService();
      },
      error => {
        console.log(error);
        if (error.status === 403) {
          localStorage.removeItem('user');
          localStorage.removeItem('jwt');
          this.getAuthorizationPage();
        }
      }
    );
  }

  getAuthorizationPage = () => {
    this.authorizationService.getAuthorizationPage().subscribe(data => {
        const {nativeWindow} = this.windowRefService;
        nativeWindow.location.href = data.text();
      },
      error => console.log(error)
    );
  }

  setUserOnService = () => {
    const lsUser = localStorage.getItem('user');
    if (lsUser) {
      this.userService.setUser(JSON.parse(lsUser));
    }
  }

  setShowLoading = () => {
    this.searching = true;

    this.timeout = setTimeout(() => {
      this.loadingMsg = 'Loading...';
      this.showLoading = true;
    }, 1250);
  }

  setHideLoading = () => {
    clearTimeout(this.timeout);
    this.showLoading = false;
    this.searching = false;
    this.loadingMsg = '';
  }
}
