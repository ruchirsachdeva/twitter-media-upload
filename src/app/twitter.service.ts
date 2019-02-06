import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Tweet} from './tweet';
import {HttpParams} from "@angular/common/http";

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

  constructor(private http: HttpClient) {
  }

  user() {
    var params = '?accessToken=' + localStorage.getItem('accessToken') + '&accessTokenSecret=' + localStorage.getItem('accessTokenSecret');
    return this.http.get<TwitterResponse>(`${environment.api}/user` + params);
  }

  login() {
    return this.http.get<TwitterResponse>(`${environment.api}/login`, {});
  }

  logout() {
    return this.http.get<TwitterResponse>(`${environment.api}/logout`, {});
  }

  authenticated() {
    return this.http.get<TokenResponse>(`${environment.api}/authenticated`, {});
  }


  home(since?: string) {
    var params = '?accessToken=' + localStorage.getItem('accessToken') + '&accessTokenSecret=' + localStorage.getItem('accessTokenSecret');
    +`&since=${since}`

    return this.http.get<TwitterResponse>(`${environment.api}/search` + params);
  }

  action(property: 'favorite'|'retweet', id: string, state: boolean) {
    var req = {
      state: state,
      accessToken: localStorage.getItem('accessToken'),
      accessTokenSecret: localStorage.getItem('accessTokenSecret')
    };
    return this.http.post<TwitterResponse>(`${environment.api}/${property}/${id}`, req);
  }

  media(file: {data: File; status: string}) {

    var req = {
      accessToken: localStorage.getItem('accessToken'),
      accessTokenSecret: localStorage.getItem('accessTokenSecret'),
      status: file.status

    };

    const blobToken = new Blob([JSON.stringify(req)], {
      type: 'application/json',
    });

    let input = new FormData();
// Add your values in here

    input.append('sampleFile', file.data);
    input.append('id', blobToken);


    let params = new HttpParams();
params.append('accessToken', localStorage.getItem('accessToken'));
    params.append('accessTokenSecret', localStorage.getItem('accessTokenSecret'));
    const options = {
      params: params,
      reportProgress: true
    };

    console.log('posting');
    return this.http.post<TwitterResponse>(`${environment.api}/media`, input, options);
  }

  mediaChunked (file: {data: File; status: string}) {
console.log(file.data);
    var req = {
      accessToken: localStorage.getItem('accessToken'),
      accessTokenSecret: localStorage.getItem('accessTokenSecret'),
      size: file.data.size
    };

    const blobToken = new Blob([JSON.stringify(req)], {
      type: 'application/json',
    });

    let input = new FormData();
// Add your values in here

    input.append('sampleFile', file.data);
    input.append('id', blobToken);


    let params = new HttpParams();
    params.append('accessToken', localStorage.getItem('accessToken'));
    params.append('accessTokenSecret', localStorage.getItem('accessTokenSecret'));
    const options = {
      params: params,
      reportProgress: true
    };

    console.log('posting');
    return this.http.post<TwitterResponse>(`${environment.api}/mediachunked`, input, options);
  }

}
