import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebAPIService } from '../../service/spotify/web-api/web-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [WebAPIService]
})
export class HomeComponent {

  constructor(private router: Router, private webAPIService: WebAPIService) {
  }

  handleSearch = (searchTerm) => {
    return this.webAPIService.search(searchTerm);
  }

  handleSelect = (item) => {
    this.webAPIService.getPlaylistFromArtist(item.id).subscribe(data => {
      const {playlistTracks} = JSON.parse(data.text());
      const arr = [];
      playlistTracks.forEach(track => {
        arr.push({artist: track.artists[0].name, trackName: track.name});
      });
      console.table(arr);
      this.router.navigate(['/result']);
    },
      error => console.log(error)
    );
  }

  getPlaylistFromTopArtists() {
    this.webAPIService.getPlaylistFromTopArtists().subscribe(data => {
        const {playlistTracks} = JSON.parse(data.text());
        const arr = [];
        playlistTracks.forEach(track => {
          arr.push({artist: track.artists[0].name, trackName: track.name});
        });
        console.table(arr);
      },
      error => console.log(error)
    );
  }
}
