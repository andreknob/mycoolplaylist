import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebAPIService } from '../../service/spotify/web-api/web-api.service';
import { UserService } from 'src/app/service/user/user.service';
import { ResultService } from 'src/app/service/result/result.service';

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

  constructor(private router: Router, private webAPIService: WebAPIService,
    private userService: UserService, private resultService: ResultService) {
    const lsUser = localStorage.getItem('user');
    if (lsUser) {
      this.userService.setUser(JSON.parse(lsUser));
    }
  }

  handleSearch = (searchTerm) => {
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
        console.log(JSON.parse(data.text()));
      },
      error => console.log(error)
    );
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
