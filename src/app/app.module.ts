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

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {
  MatButtonModule, MatCardModule, MatInputModule, MatListModule, MatToolbarModule,
  MatMenuModule, MatIconModule, MatTableModule, MatRadioModule, MatProgressSpinnerModule, MatSortModule, MatPaginatorModule
} from '@angular/material';


import { UserComponent } from './user/user.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";


@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    TweetsComponent,
    TweetPipe,
    HomeComponent,
    LoginComponent,
    UserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FacebookModule.forRoot(),
    HttpClientModule,
    ClarityModule,
    MomentModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

