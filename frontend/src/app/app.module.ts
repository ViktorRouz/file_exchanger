import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';


import {AuthenticateService} from './_services/auth/authenticate.service';

import {AuthGuard} from './guards/auth.guard';
import {LoginGuard} from './guards/login.guard';

import {NgxPaginationModule} from 'ngx-pagination';
import {NgFlashMessagesModule} from 'ng-flash-messages';
import {FileUploadModule} from 'ng2-file-upload';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgFlashMessagesModule.forRoot(),
    NgxPaginationModule,
    FileUploadModule
  ],
  providers: [
    AuthenticateService,
    AuthGuard,
    LoginGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
