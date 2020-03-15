import {Injectable} from '@angular/core';
import {User} from '../../_models/user';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() {
  }

  public validateRegister(user: any) {
    return !(user.name === undefined || user.email === undefined || user.password === undefined);
  }

  public validatePassword(password: string): boolean {
    return /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);
  }

  public validateLogin(user: any): boolean {
    return !(user.email === undefined || user.password === undefined);
  }

  public validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public validateProfile(user: any): boolean {
    if (user.name !== undefined && user.aboutYourself !== undefined) {
      if (user.name.trim() !== '' && user.aboutYourself.trim() !== '') {
        user.name = user.name.trim().replace(/\s\s+/g, ' ');
        user.aboutYourself = user.aboutYourself.trim().replace(/\s\s+/g, ' ');
        return !(user.name.length === 0 || user.aboutYourself.length === 0);
      } else {
        return false;
      }
    } else {
      return !(user.newsTitle === undefined || user.aboutYourself === undefined);
    }
  }

  public validateImage(name: string, password: string): boolean {
    if (name !== undefined && password !== undefined) {
      if (name.trim() !== '' && password.trim() !== '') {
        name = name.trim().replace(/\s\s+/g, ' ');
        password = password.trim().replace(/\s\s+/g, ' ');
        return (name.length !== 0 && password.length !== 0);
      }
    } else {
      return false;
    }
  }

  public validateDownloadImageId(downloadImageId: string): boolean {
    if (downloadImageId !== undefined) {
      if (downloadImageId.trim() !== '') {
        downloadImageId = downloadImageId.trim().replace(/\s\s+/g, ' ');
        return !(downloadImageId.length === 0);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public validateDownloadPassword(downloadPassword: string): boolean {
    if (downloadPassword !== undefined) {
      if (downloadPassword.trim() !== '') {
        downloadPassword = downloadPassword.trim().replace(/\s\s+/g, ' ');
        return !(downloadPassword.length < 6);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
