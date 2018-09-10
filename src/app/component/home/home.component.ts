import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/spotify/authorization/authorization.service';
import { WebAPIService } from '../../service/spotify/web-api/web-api.service';
import { WindowRefService } from '../../service/window/window-ref.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthorizationService, WebAPIService]
})
export class HomeComponent implements OnInit {

  constructor(private authorizationService: AuthorizationService, private webAPIService: WebAPIService,
    private windowRefService: WindowRefService) {
  }

  ngOnInit() {
  }

  getAuthorizationPage() {
    this.authorizationService.getAuthorizationPage().subscribe(data => {
        const {nativeWindow} = this.windowRefService;
        const page = JSON.parse(JSON.stringify(data))._body;
        nativeWindow.location.href = page;
      },
      error => console.log(error)
    );
  }
}
