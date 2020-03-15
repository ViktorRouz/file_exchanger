import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ValidateService} from '../_services/validate/validate.service';
import {AuthenticateService} from '../_services/auth/authenticate.service';
import {NgFlashMessageService} from 'ng-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthenticateService,
    private router: Router,
    private flashMessage: NgFlashMessageService
  ) {
  }

  ngOnInit() {

  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Required field
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.showFlashMessage({
        messages: ['Please fill in all field'],
        timeout: 3000,
        type: 'danger'
      });
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.showFlashMessage({
        messages: ['Please use a valid email'],
        timeout: 3000,
        type: 'danger'
      });
      return false;
    }

    // Validate password
    if (!this.validateService.validatePassword(user.password)) {
      this.flashMessage.showFlashMessage({
        messages: ['The password must contain letters and numbers, and also include one capital letter'],
        timeout: 5000,
        type: 'danger'
      });
      return false;
    }

    // Register user
    if (this.password.length > 5) {
      if (this.password === this.passwordConfirm) {
        this.authService.registerUser(user).subscribe((data: any) => {
          if (data.success) {
            this.flashMessage.showFlashMessage({
              messages: ['You are now registered and can log in!'],
              timeout: 3000,
              type: 'success'
            });
            this.router.navigate(['/login']);
          } else {
            this.flashMessage.showFlashMessage({
              messages: ['Something went wrong!'],
              timeout: 3000,
              type: 'danger'
            });
            this.router.navigate(['/register']);
          }
        });
      } else {
        this.flashMessage.showFlashMessage({
          messages: ['Passwords do not match!'],
          timeout: 3000,
          type: 'danger'
        });
      }
    } else {
      this.flashMessage.showFlashMessage({
        messages: ['The minimum password length is 6 characters!'],
        timeout: 3000,
        type: 'danger'
      });
    }
  }

}
