import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticateService} from './_services/auth/authenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  id: string;

  constructor(
    private router: Router,
    public authService: AuthenticateService
  ) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      this.id = this.authService.getIdUser();
    });
  }

}

