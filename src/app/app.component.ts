import {Component} from '@angular/core';
import {TwitterService, TokenResponse, TwitterResponse} from './twitter.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TwitterService]

})
export class AppComponent {
  title = 'web-mobile-dev-assignment1';
  result = '';
  user;

  constructor(private twitter: TwitterService, private router: Router) {


    this.updateToken();

    if (this.authenticated()) {
      this.twitter.user().subscribe((user: TwitterResponse) => {
        console.log('got response');
        console.log(user);
        this.user = user.data;

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
      && notExists('accessToken', null) && notExists('accessTokenSecret', null);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  updateToken() {
    if (this.authenticated()) {
      console.log(localStorage.getItem('accessToken'));
    }
    else {
      console.log('updateToken');
      this.twitter.authenticated()
        .subscribe((response: TokenResponse) => {
          console.log(response.accessToken);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('accessTokenSecret', response.accessTokenSecret);
        });
    }
  }


  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }


}
