import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AngularFontAwesomeModule} from 'angular-font-awesome';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';

import {ValidateService} from './_services/validate/validate.service';
import {AuthenticateService} from './_services/auth/authenticate.service';
import {ImageService} from './_services/image/image.service';

import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from './guards/login.guard';

import {NgxPaginationModule} from 'ngx-pagination';
import {NgFlashMessagesModule} from 'ng-flash-messages';
import {FileUploadModule} from 'ng2-file-upload';
import {GetImageComponent} from './get-image/get-image.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    GetImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgFlashMessagesModule.forRoot(),
    NgxPaginationModule,
    FileUploadModule,
    AngularFontAwesomeModule,
  ],
  providers: [
    ValidateService,
    AuthenticateService,
    AuthGuard,
    LoginGuard,
    ImageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
