import { Component } from '@angular/core';
import { WebAPIService } from './service/spotify/web-api/web-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'unlistenedplaylist';

    constructor(private webAPIService: WebAPIService) {
    }

  private connect() {
  }
}
