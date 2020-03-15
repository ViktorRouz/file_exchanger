import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticateService} from '../_services/auth/authenticate.service';
import {NgFlashMessageService} from 'ng-flash-messages';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    private authService: AuthenticateService,
    private router: Router,
    private flashMessage: NgFlashMessageService,
  ) {
  }

  ngOnInit() {
  }

  public onLoginSubmit(): any {
    const user = {
      email: this.email,
      password: this.password
    };
  

    this.authService.authenticateUser(user).subscribe((data: any) => {
      if (data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.router.navigate([`/profile/${data.user.id}`]);
      } else {
        this.flashMessage.showFlashMessage({
          messages: [data.message],
          timeout: 5000,
          type: 'danger'
        });
        this.router.navigate(['/login']);
      }
    });
  }
}
