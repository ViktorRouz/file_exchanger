import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  authToken: any;
  user: any;
  idProfile: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/register`, user, {headers}).pipe(
      map(res => res));
  }

  authenticateUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${environment.apiUrl}/authenticate`, user, {headers}).pipe(
      map(res => res));
  }

  getProfile() {
    this.loadToken();
    this.idProfile = this.router.url;
    const headers = new HttpHeaders({Authorization: this.authToken, 'Content-Type': 'application/json'});
    return this.http.get(`${environment.apiUrl}${this.idProfile}`, {headers})
      .pipe(map(res => res));
  }

  updateProfile(user) {
    this.loadToken();
    this.idProfile = JSON.parse(localStorage.getItem('user')).id;
    const headers = new HttpHeaders({Authorization: this.authToken, 'Content-Type': 'application/json'});
    return this.http.put(`${environment.apiUrl}/profile/${this.idProfile}`, user, {headers})
      .pipe(map(res => res));
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  updateStoreUser(user) {
    const userAuth: object = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    localStorage.setItem('user', JSON.stringify(userAuth));
  }

  loadToken() {
    this.authToken = localStorage.getItem('id_token');
  }

  getUserPayload() {
    this.loadToken();
    if (this.authToken) {
      const userPayload = atob(this.authToken.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  loggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000; } else {
      return false; }
  }

  getIdUser() {
    if (localStorage.getItem('user') !== null) {
      return JSON.parse(localStorage.getItem('user')).id;
    }
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
