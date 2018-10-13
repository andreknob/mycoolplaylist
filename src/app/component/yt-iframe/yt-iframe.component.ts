import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-yt-iframe',
  templateUrl: './yt-iframe.component.html',
  styleUrls: ['./yt-iframe.component.css']
})
export class YtIframeComponent implements OnInit {
  public YT: any;
  public player: any;

  constructor(public sanitizer: DomSanitizer) {
  }

  init() {
    const tag = document.createElement('script');
    // @todo find a way to use ssl only when is production
    tag.src = 'http://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnInit() {
    this.init();

    window['onYouTubeIframeAPIReady'] = (e) => {
      this.YT = window['YT'];
      this.player = new window['YT'].Player('player', {
        videoId: 'hi4pzKvuEQM', // 1cH2cerUpMQ
        playerVars: { 'rel': 0, 'controls': 0, 'showinfo': 0, 'modestbranding': 1 },
        events: {
          'onStateChange': this.onPlayerStateChange.bind(this),
          'onError': this.onPlayerError.bind(this),
          'onReady': event => {
            event.target.setVolume(0);
            event.target.playVideo();
          }
        }
      });
    };
  }

  onPlayerStateChange(event) {
    console.log(event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() === 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }

  // utility
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }

  onPlayerError(event) {
    console.log('error');
    switch (event.data) {
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

}
