import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetImageService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getImage(downloadingData) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(`${environment.apiUrl}/download-file`, downloadingData, {
      responseType: 'blob',
      headers
    });
  }

  public getDataImage(idImage) {
    const url = `${environment.apiUrl}/download-file?idFile=${idImage}`;
    return this.http.get(url);
  }
}
