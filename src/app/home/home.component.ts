import { Component, OnInit } from '@angular/core';
import {TwitterService} from "../twitter.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private twitter: TwitterService) { }

  ngOnInit() {

  }

  upload() {
    console.log('component called');
    this.twitter.media();
  }

  authenticated() {
    function notExists(key: string, val: any) {
      return localStorage.getItem(key) !== val;
    }

    return notExists('accessToken', 'undefined') && notExists('accessTokenSecret', 'undefined')
      && notExists('accessToken', null) && notExists('accessTokenSecret', null);
  }

}
