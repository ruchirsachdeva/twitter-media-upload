import {Component, OnInit} from '@angular/core';
import {TwitterService, TokenResponse, TwitterResponse} from './twitter.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TwitterService]

})
export class AppComponent implements OnInit {
  title = 'web-mobile-dev-assignment1';
  result = '';
  user;

  constructor(private twitter: TwitterService, private router: Router) {



  }

  ngOnInit() {
    this.updateToken();
    if (this.authenticated()) {
      console.log(localStorage.getItem('accessToken'));
      this.router.navigateByUrl('/home');
    }
    else {
      console.log('updateToken');
      this.twitter.authenticated()
        .subscribe((response: TokenResponse) => {
          console.log(response.accessToken);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('accessTokenSecret', response.accessTokenSecret);
          if (this.authenticated()) {
            console.log(localStorage.getItem('accessToken'));
            this.router.navigateByUrl('/home');
          }else {
            this.router.navigateByUrl('/login');
          }
        });
    }

  }

  getHomeTimeline() {
    window.location.href = 'https://twitter-media-app.herokuapp.com/api/login';
    //  this.twitter.login().subscribe(access_token => console.log(access_token));
  }

  authenticated() {
    function notExists(key: string, val: any) {
      return localStorage.getItem(key) !== val;
    }

    return notExists('accessToken', 'undefined') && notExists('accessTokenSecret', 'undefined')
      && notExists('accessToken', null) && notExists('accessTokenSecret', null)
      && notExists('accessToken', 'null') && notExists('accessTokenSecret', 'null');
  }

  logout() {
    localStorage.clear();
    this.twitter.logout()
      .subscribe((user: TwitterResponse) => {
        console.log('logged out');
        this.router.navigateByUrl('/login');
      });
  }

  updateToken() {

  }


  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }


}
