import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Tweet } from './tweet';

export interface TwitterResponse {
  data: any;
  resp: any;
}

export interface TokenResponse {
  accessToken: any;
  accessTokenSecret: any;
}

@Injectable()
export class TwitterService {

  constructor(private http: HttpClient) { }

  user() {
    var params = '?accessToken='+localStorage.getItem('accessToken')+'&accessTokenSecret='+localStorage.getItem('accessTokenSecret');
    return this.http.get<TwitterResponse>(`${environment.api}/user`+params);
  }

  login() {
    return this.http.get<TwitterResponse>(`${environment.api}/login`, {});
  }
  authenticated() {
    return this.http.get<TokenResponse>(`${environment.api}/authenticated`, {});
  }


  home(since?: string) {
    var params = '?accessToken='+localStorage.getItem('accessToken')+'&accessTokenSecret='+localStorage.getItem('accessTokenSecret');+`&since=${since}`

    return this.http.get<TwitterResponse>(`${environment.api}/home`+params);
  }

  action(property: 'favorite'|'retweet', id: string, state: boolean) {
    var req = {state: state,
    accessToken:localStorage.getItem('accessToken'),
      accessTokenSecret: localStorage.getItem('accessTokenSecret')};
    return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, req);
  }

  media() {
    var req = {
      accessToken:localStorage.getItem('accessToken'),
      accessTokenSecret: localStorage.getItem('accessTokenSecret')};
    console.log('posting');
    return this.http.post<TwitterResponse>(`${environment.api}/media`, req);
  }

}
