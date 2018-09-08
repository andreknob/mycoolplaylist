import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private userId: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.userId = params['id']);
  }

  ngOnInit() {
  }

}
