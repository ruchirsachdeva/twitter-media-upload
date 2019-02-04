import {Component} from '@angular/core';
import {FacebookService, InitParams, LoginResponse, UIResponse, UIParams} from "ngx-facebook";
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

  constructor(private fb: FacebookService, private twitter: TwitterService, private router: Router) {

    let initParams: InitParams = {
      appId: '203064913467897',
      xfbml: true,
      version: 'v2.8'
    };

    fb.init(initParams);

    this.updateToken();
    // this.twitter.login().subscribe(access_token => console.log(access_token));

    //  this.loginWithFacebook(); // nothing happens in this call, but ui tag works ??
    // this.share();  // nothing happens in this call, but ui tag works ??

    if (this.authenticated()) {
      this.twitter.user().subscribe((user: TwitterResponse) => {
        console.log('got response');
        console.log(user);
        this.user = user.data;

      });
    }
  }

  getHomeTimeline() {
    window.location.href = 'http://localhost:4200/api/login';
    //  this.twitter.login().subscribe(access_token => console.log(access_token));
  }

  authenticated() {
    console.log(localStorage.getItem('accessToken'));
    console.log(localStorage.getItem('accessTokenSecret'));
    function notExists(key: string, val: any) {
      return localStorage.getItem(key) !== val;
    }

    return notExists('accessToken', 'undefined') && notExists('accessTokenSecret', 'undefined')
      && notExists('accessToken', null) && notExists('accessTokenSecret', null);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/');

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


  loginWithFacebook(): void {

    this.fb.login()
      .then((response: LoginResponse) => console.log(response))
      .catch((error: any) => console.error(error));

  }

  share() {

    let params: UIParams = {
      href: 'https://github.com/zyra/ngx-facebook',
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }


}
