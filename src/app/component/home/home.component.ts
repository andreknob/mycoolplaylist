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

  private loading = false;
  private loadingMsg = '';

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
    this.loadingMsg = 'Loading...';
    this.loading = true;
    this.webAPIService.getPlaylistFromArtist(item.id).subscribe(data => {
      const {playlistTracks} = JSON.parse(data.text());
      this.resultService.playlistTracks = playlistTracks;
      // @todo identificar por que getPlaylistFromArtist 'Greta Link' retorna vazio
      /* const arr = [];
      playlistTracks.forEach(track => {
        arr.push({artist: track.artists[0].name, trackName: track.name});
      });
      console.table(arr);*/
      this.router.navigate(['/playlist']);
    },
      error => console.log(error)
    );
  }

  getPlaylistFromTopArtists = () => {
    this.loadingMsg = 'Loading...';
    this.loading = true;
    this.webAPIService.getPlaylistFromTopArtists().subscribe(data => {
      const {playlistTracks} = JSON.parse(data.text());
      this.resultService.playlistTracks = playlistTracks;
      this.router.navigate(['/playlist']);
      },
      error => console.log(error)
    );
  }
}
