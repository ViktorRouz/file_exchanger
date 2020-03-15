import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthenticateService } from "../_services/auth/authenticate.service";

@Injectable()

export class LoginGuard implements CanActivate{
  constructor(
    private authService: AuthenticateService,
    private router: Router
  ){
  }

  canActivate() {
    if(this.authService.loggedIn()){
      let idUser = JSON.parse(localStorage.getItem('user')).id;
      this.router.navigate([`/profile/${idUser}`]);
      return false
    } else {
      return true;
    }
  }
}
