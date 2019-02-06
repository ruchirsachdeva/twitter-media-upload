import {Component, OnInit} from '@angular/core';
import {TwitterService, TwitterResponse} from "../twitter.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  file = {data: null, status: '', size: 0, type: '', isimage:true};

  selectedMedia: string;
  medias: string[] = ['Image', 'Video'];
  public showSpinner: boolean = false;


  constructor(private twitter: TwitterService, private router: Router) {
  }

  ngOnInit() {
    this.selectedMedia = this.medias[0];
    if(!this.authenticated()) {
      this.router.navigateByUrl('/');
    }
  }

  changeComboo(event) {
    console.log('chnaged', event && event.value);
  }

  onImageSelected(fileInput: any) {
    this.onFileSelected(fileInput[0]);
    this.file.isimage = true;
  }

  onVideoSelected(fileInput: any) {
    this.onFileSelected(fileInput[0]);
    this.file.isimage = false;
  }

  onFileSelected(file: File) {
    console.log(file);
  /**  var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.file.data = myReader.result;
      console.log(myReader.result);
    }
    myReader.readAsDataURL(file);*/

    this.file.data = file;
    this.file.size = file.size;
    this.file.type = file.type;
  }

  upload() {
    console.log('upload');
    console.log(this.file.isimage);
    this.showLoadingSpinner();

    if(this.file.isimage) {
    this.twitter.media(this.file)
      .subscribe((res: TwitterResponse) => {
        console.log('got media response');
        console.log(res);
        // response received so hide spinner now
        this.hideLoadingSpinner();
      });
    } else {
      this.twitter.mediaChunked(this.file)
        .subscribe((res: TwitterResponse) => {
          console.log('got mediachunked response');
          console.log(res);
          // response received so hide spinner now
          this.hideLoadingSpinner();
        });
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





  showLoadingSpinner() {
    this.showSpinner = true;
  }

  hideLoadingSpinner() {
    this.showSpinner = false;
  }

}
