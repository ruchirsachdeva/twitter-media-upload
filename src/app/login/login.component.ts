import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    if(this.authenticated()) {
      this.router.navigateByUrl('/home');
    }


  }
  authenticated() {
    function notExists(key: string, val: any) {
      return localStorage.getItem(key) !== val;
    }

    return notExists('accessToken', 'undefined') && notExists('accessTokenSecret', 'undefined')
      && notExists('accessToken', null) && notExists('accessTokenSecret', null)
      && notExists('accessToken', 'null') && notExists('accessTokenSecret', 'null');
  }

}
