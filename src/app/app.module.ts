import { BrowserModule } from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FacebookModule} from "ngx-facebook";
import {HttpClientModule} from "@angular/common/http";
import {TweetComponent} from "./tweet/tweet.component";
import {TweetsComponent} from "./tweets/tweets.component";
import {TweetPipe} from "./tweet.pipe";
import { ClarityModule } from '@clr/angular';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    TweetsComponent,
    TweetPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FacebookModule.forRoot(),
    HttpClientModule,
    ClarityModule,
    MomentModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

