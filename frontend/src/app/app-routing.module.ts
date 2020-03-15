import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GetImageComponent} from './get-image/get-image.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {AuthGuard} from "./guards/auth.guard";
import {LoginGuard} from "./guards/login.guard";

const routes: Routes = [
  {
    path: 'get-image',
    component: GetImageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoginGuard]
  },
  {
    path: '',
    redirectTo: '/get-image',
    pathMatch: 'full'
  },

  // otherwise redirect to home
  {
    path: '**',
    redirectTo: '/get-image'
  },
  { path: "profile/**", redirectTo:"/get-image"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
