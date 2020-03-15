import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';

import {FileUploader} from "ng2-file-upload";

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  public idProfile: string = JSON.parse(localStorage.getItem('user')).id;
  public authToken: string;

  public uriProfile: string = `${environment.apiUrl}/profile/${this.idProfile}`;
  public uriImage: string;

  public uploaderProfile: FileUploader = new FileUploader({url: this.uriProfile});
  public uploaderImage: FileUploader = new FileUploader({url: this.uriImage});

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.uploaderProfile.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };

    this.uploaderImage.onBeforeUploadItem = (item) => {
      item.url = `${environment.apiUrl}/profile/${this.idProfile}/files`;
      item.withCredentials = false;
    };
  }

  private getIdProfile() {
    return JSON.parse(localStorage.getItem('user')).id;
  }

  private getAuthToken() {
    return localStorage.getItem('id_token');
  }

  public deletePhotoProfile() {
    this.authToken = localStorage.getItem('id_token');
    let headers = new HttpHeaders({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    return this.http.delete(`${environment.apiUrl}/profile/${this.idProfile}`, {headers: headers})
  }

  public getImage(downloadingData) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(`${environment.apiUrl}/download-file`, downloadingData, {
      responseType: "blob",
      headers: headers
    });
  }

  public getImagesAuthor() {
    this.idProfile = this.router.url.substr(9);
    return this.http.get(`${environment.apiUrl}/profile/${this.idProfile}/files`);
  }

  public deleteImage(imageId) {
    this.idProfile = this.getIdProfile();
    this.authToken = this.getAuthToken();
    let headers = new HttpHeaders({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    return this.http.delete(`${environment.apiUrl}/profile/${this.idProfile}/files/${imageId}`, {headers: headers})
  }
}
