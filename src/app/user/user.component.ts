import { Component, OnInit } from '@angular/core';
import {TwitterService, TwitterResponse} from "../twitter.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user;

  constructor(private twitter: TwitterService) { }

  authenticated() {
    function notExists(key: string, val: any) {
      return localStorage.getItem(key) !== val;
    }

    return notExists('accessToken', 'undefined') && notExists('accessTokenSecret', 'undefined')
      && notExists('accessToken', null) && notExists('accessTokenSecret', null);
  }


  ngOnInit() {
    if (this.authenticated()) {
      this.twitter.user().subscribe((user: TwitterResponse) => {
        console.log('got response');
        console.log(user);
        this.user = user.data;

      });
    }
  }

}
