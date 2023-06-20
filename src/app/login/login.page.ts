import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: String = ''
  pwd: String = ''
  check: Boolean = true

  constructor(private route: Router ,private loginService: LoginService, private session: SessionService) {

   }

  ngOnInit() {
    this.checkSession()
  }

  login(){
    this.loginService.getUser(this.user, this.pwd).subscribe( resp => {
      this.session.guardarSesion(resp).then( () => {
        this.pwd = ''
        this.checkSession()
      })
    })
  }

  checkSession(){
    this.session.getSession().then( resp => {
      if(resp.loggedIn || resp.loggedIn != null){
        if(resp.Rol == 1){
          this.route.navigateByUrl('/inicio')
        }else{
          this.route.navigateByUrl('/admin')
        }
        
        this.check = true
      }else{
        this.check = false
      }
    })
  }
}
